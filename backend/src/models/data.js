import { hashPassword } from '../auth/auth.js';

export const users = [];
export const shipments = [];

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'XPO Logistics'];
const statuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'CANCELLED'];
const cities = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Miami, FL',
  'Seattle, WA',
  'Denver, CO'
];

export const initializeUsers = async () => {
  if (users.length === 0) {
    users.push(
      {
        id: '1',
        username: 'admin',
        password: await hashPassword('admin123'),
        email: 'admin@ultraship.com',
        role: 'ADMIN'
      },
      {
        id: '2',
        username: 'employee',
        password: await hashPassword('employee123'),
        email: 'employee@ultraship.com',
        role: 'EMPLOYEE'
      }
    );
  }
};

const randomFutureDate = () => {
  const days = Math.floor(Math.random() * 14) + 1;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const randomPastDate = () => {
  const days = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const initializeShipments = () => {
  if (shipments.length === 0) {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const origin = cities[Math.floor(Math.random() * cities.length)];
      let destination = cities[Math.floor(Math.random() * cities.length)];
      while (destination === origin) {
        destination = cities[Math.floor(Math.random() * cities.length)];
      }

      shipments.push({
        id: String(i),
        trackingNumber: `TRK${String(i).padStart(8, '0')}`,
        origin,
        destination,
        status,
        carrier,
        weight: (Math.random() * 500 + 10).toFixed(2),
        dimensions: `${Math.floor(Math.random() * 30 + 10)}x${Math.floor(Math.random() * 30 + 10)}x${Math.floor(Math.random() * 30 + 10)}`,
        estimatedDelivery: randomFutureDate(),
        actualDelivery: status === 'DELIVERED' ? randomPastDate() : null,
        cost: (Math.random() * 500 + 50).toFixed(2),
        customerName: `${firstName} ${lastName}`,
        customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        notes: Math.random() > 0.7 ? 'Handle with care - Fragile items' : null,
        createdAt: randomPastDate(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        flagged: Math.random() > 0.9
      });
    }
  }
};

export const findUserByUsername = (username) => {
  return users.find(u => u.username === username);
};

export const findUserById = (id) => {
  return users.find(u => u.id === id);
};

export const createUser = async (userData) => {
  const user = {
    id: String(users.length + 1),
    ...userData,
    password: await hashPassword(userData.password)
  };
  users.push(user);
  return user;
};

export const findShipmentById = (id) => {
  return shipments.find(s => s.id === id);
};

export const createShipment = (shipmentData, userId) => {
  const shipment = {
    id: String(shipments.length + 1),
    ...shipmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: userId,
    flagged: shipmentData.flagged || false
  };
  shipments.push(shipment);
  return shipment;
};

export const updateShipment = (id, shipmentData) => {
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) return null;

  shipments[index] = {
    ...shipments[index],
    ...shipmentData,
    updatedAt: new Date().toISOString()
  };
  return shipments[index];
};

export const deleteShipment = (id) => {
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) return false;

  shipments.splice(index, 1);
  return true;
};
