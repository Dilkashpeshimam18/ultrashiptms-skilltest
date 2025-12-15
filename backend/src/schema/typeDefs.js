import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: UserRole!
    email: String!
  }

  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Shipment {
    id: ID!
    trackingNumber: String!
    origin: String!
    destination: String!
    status: ShipmentStatus!
    carrier: String!
    weight: Float!
    dimensions: String!
    estimatedDelivery: String!
    actualDelivery: String
    cost: Float!
    customerName: String!
    customerEmail: String!
    notes: String
    createdAt: String!
    updatedAt: String!
    createdBy: String!
    flagged: Boolean!
  }

  enum ShipmentStatus {
    PENDING
    IN_TRANSIT
    DELIVERED
    DELAYED
    CANCELLED
  }

  input ShipmentInput {
    trackingNumber: String!
    origin: String!
    destination: String!
    status: ShipmentStatus!
    carrier: String!
    weight: Float!
    dimensions: String!
    estimatedDelivery: String!
    actualDelivery: String
    cost: Float!
    customerName: String!
    customerEmail: String!
    notes: String
    flagged: Boolean
  }

  input ShipmentFilterInput {
    status: ShipmentStatus
    carrier: String
    origin: String
    destination: String
    customerName: String
    flagged: Boolean
    searchTerm: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum ShipmentSortField {
    trackingNumber
    origin
    destination
    status
    estimatedDelivery
    cost
    createdAt
  }

  input SortInput {
    field: ShipmentSortField!
    order: SortOrder!
  }

  type ShipmentConnection {
    edges: [ShipmentEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ShipmentEdge {
    node: Shipment!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Query {
    # Get all shipments with optional filtering and sorting
    shipments(
      filter: ShipmentFilterInput
      sort: SortInput
      limit: Int
      offset: Int
    ): [Shipment!]!

    # Get paginated shipments
    shipmentsPaginated(
      first: Int
      after: String
      filter: ShipmentFilterInput
      sort: SortInput
    ): ShipmentConnection!

    # Get a single shipment by ID
    shipment(id: ID!): Shipment

    # Get current user
    me: User
  }

  type Mutation {
    # Authentication
    login(username: String!, password: String!): AuthPayload!
    register(username: String!, password: String!, email: String!, role: UserRole): AuthPayload!

    # Shipment mutations (authentication required)
    createShipment(input: ShipmentInput!): Shipment!
    updateShipment(id: ID!, input: ShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!
    toggleShipmentFlag(id: ID!): Shipment!
  }
`;
