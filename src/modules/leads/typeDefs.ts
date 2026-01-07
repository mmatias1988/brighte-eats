/**
 * GraphQL schema definitions for Lead operations
 */

export const leadTypeDefs = `#graphql
  """
  Service types available for Brighte Eats
  """
  enum Service {
    DELIVERY
    PICKUP
    PAYMENT
  }

  """
  Service selection with metadata
  """
  type LeadService {
    id: ID!
    serviceType: Service!
    createdAt: DateTime!
  }

  """
  Lead entity representing a customer expression of interest
  """
  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [LeadService!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Input for registering a new lead
  """
  input RegisterLeadInput {
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [Service!]!
  }

  """
  Query operations for leads
  """
  type Query {
    """
    Retrieve all leads with their services
    """
    leads: [Lead!]!

    """
    Retrieve a single lead by ID with their services
    """
    lead(id: ID!): Lead
  }

  """
  Mutation operations for leads
  """
  type Mutation {
    """
    Register a new lead with their service interests
    """
    register(input: RegisterLeadInput!): Lead!
  }

  """
  DateTime scalar type (ISO 8601 format)
  """
  scalar DateTime
`;

