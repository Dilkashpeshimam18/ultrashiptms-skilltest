import { gql } from '@apollo/client';

// Authentication Queries
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $email: String!, $role: UserRole) {
    register(username: $username, password: $password, email: $email, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
    }
  }
`;

// Shipment Queries
export const GET_SHIPMENTS = gql`
  query GetShipments($filter: ShipmentFilterInput, $sort: SortInput, $limit: Int, $offset: Int) {
    shipments(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
      id
      trackingNumber
      origin
      destination
      status
      carrier
      weight
      dimensions
      estimatedDelivery
      actualDelivery
      cost
      customerName
      customerEmail
      notes
      createdAt
      updatedAt
      createdBy
      flagged
    }
  }
`;

export const GET_SHIPMENTS_PAGINATED = gql`
  query GetShipmentsPaginated($first: Int, $after: String, $filter: ShipmentFilterInput, $sort: SortInput) {
    shipmentsPaginated(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        node {
          id
          trackingNumber
          origin
          destination
          status
          carrier
          weight
          dimensions
          estimatedDelivery
          actualDelivery
          cost
          customerName
          customerEmail
          notes
          createdAt
          updatedAt
          createdBy
          flagged
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_SHIPMENT = gql`
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      id
      trackingNumber
      origin
      destination
      status
      carrier
      weight
      dimensions
      estimatedDelivery
      actualDelivery
      cost
      customerName
      customerEmail
      notes
      createdAt
      updatedAt
      createdBy
      flagged
    }
  }
`;

// Shipment Mutations
export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: ShipmentInput!) {
    createShipment(input: $input) {
      id
      trackingNumber
      origin
      destination
      status
      carrier
      weight
      dimensions
      estimatedDelivery
      actualDelivery
      cost
      customerName
      customerEmail
      notes
      createdAt
      updatedAt
      createdBy
      flagged
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: ShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      trackingNumber
      origin
      destination
      status
      carrier
      weight
      dimensions
      estimatedDelivery
      actualDelivery
      cost
      customerName
      customerEmail
      notes
      createdAt
      updatedAt
      createdBy
      flagged
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const TOGGLE_SHIPMENT_FLAG = gql`
  mutation ToggleShipmentFlag($id: ID!) {
    toggleShipmentFlag(id: $id) {
      id
      flagged
    }
  }
`;
