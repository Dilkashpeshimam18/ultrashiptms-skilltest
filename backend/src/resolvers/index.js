import {
  generateToken,
  comparePassword,
  requireAuth,
  requireAdmin
} from '../auth/auth.js';
import {
  users,
  shipments,
  findUserByUsername,
  createUser,
  findShipmentById,
  createShipment,
  updateShipment,
  deleteShipment
} from '../models/data.js';

const applyFilters = (shipmentsList, filter) => {
  if (!filter) return shipmentsList;

  return shipmentsList.filter(shipment => {
    if (filter.status && shipment.status !== filter.status) return false;
    if (filter.carrier && shipment.carrier !== filter.carrier) return false;
    if (filter.origin && !shipment.origin.toLowerCase().includes(filter.origin.toLowerCase())) return false;
    if (filter.destination && !shipment.destination.toLowerCase().includes(filter.destination.toLowerCase())) return false;
    if (filter.customerName && !shipment.customerName.toLowerCase().includes(filter.customerName.toLowerCase())) return false;
    if (filter.flagged !== undefined && shipment.flagged !== filter.flagged) return false;
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      return (
        shipment.trackingNumber.toLowerCase().includes(term) ||
        shipment.customerName.toLowerCase().includes(term) ||
        shipment.origin.toLowerCase().includes(term) ||
        shipment.destination.toLowerCase().includes(term) ||
        shipment.carrier.toLowerCase().includes(term)
      );
    }
    return true;
  });
};

const applySorting = (shipmentsList, sort) => {
  if (!sort) return shipmentsList;

  return [...shipmentsList].sort((a, b) => {
    let aVal = a[sort.field];
    let bVal = b[sort.field];

    if (sort.field === 'cost' || sort.field === 'weight') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (sort.field === 'estimatedDelivery' || sort.field === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sort.order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return sort.order === 'ASC' ? 1 : -1;
    return 0;
  });
};

export const resolvers = {
  Query: {
    shipments: (_, { filter, sort, limit, offset }, { user }) => {
      requireAuth(user);

      let result = applyFilters(shipments, filter);
      result = applySorting(result, sort);

      if (offset !== undefined) {
        result = result.slice(offset);
      }
      if (limit !== undefined) {
        result = result.slice(0, limit);
      }

      return result;
    },

    shipmentsPaginated: (_, { first = 10, after, filter, sort }, { user }) => {
      requireAuth(user);

      let result = applyFilters(shipments, filter);
      result = applySorting(result, sort);

      let startIndex = 0;
      if (after) {
        const cursorIndex = result.findIndex(s => s.id === after);
        if (cursorIndex !== -1) {
          startIndex = cursorIndex + 1;
        }
      }

      const paginatedResults = result.slice(startIndex, startIndex + first);
      const hasNextPage = startIndex + first < result.length;
      const hasPreviousPage = startIndex > 0;

      return {
        edges: paginatedResults.map(node => ({
          node,
          cursor: node.id
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: paginatedResults[0]?.id || null,
          endCursor: paginatedResults[paginatedResults.length - 1]?.id || null
        },
        totalCount: result.length
      };
    },

    shipment: (_, { id }, { user }) => {
      requireAuth(user);
      return findShipmentById(id);
    },

    me: (_, __, { user }) => {
      if (!user) return null;
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      };
    }
  },

  Mutation: {
    login: async (_, { username, password }) => {
      const user = findUserByUsername(username);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      };
    },

    register: async (_, { username, password, email, role = 'EMPLOYEE' }) => {
      const existingUser = findUserByUsername(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const user = await createUser({
        username,
        password,
        email,
        role
      });

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      };
    },

    createShipment: (_, { input }, { user }) => {
      requireAdmin(user);
      return createShipment(input, user.username);
    },

    updateShipment: (_, { id, input }, { user }) => {
      requireAuth(user);

      if (user.role === 'EMPLOYEE') {
        const allowedFields = ['status', 'notes', 'actualDelivery'];
        const restrictedInput = {};
        allowedFields.forEach(field => {
          if (input[field] !== undefined) {
            restrictedInput[field] = input[field];
          }
        });
        const updated = updateShipment(id, restrictedInput);
        if (!updated) throw new Error('Shipment not found');
        return updated;
      }

      const updated = updateShipment(id, input);
      if (!updated) throw new Error('Shipment not found');
      return updated;
    },

    deleteShipment: (_, { id }, { user }) => {
      requireAdmin(user);
      return deleteShipment(id);
    },

    toggleShipmentFlag: (_, { id }, { user }) => {
      requireAuth(user);
      const shipment = findShipmentById(id);
      if (!shipment) throw new Error('Shipment not found');

      return updateShipment(id, { flagged: !shipment.flagged });
    }
  }
};
