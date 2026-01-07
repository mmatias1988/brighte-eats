import { gql } from '@apollo/client';

export const GET_LEADS = gql`
  query GetLeads {
    leads {
      id
      name
      email
      mobile
      postcode
      services {
        id
        serviceType
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAD = gql`
  query GetLead($id: ID!) {
    lead(id: $id) {
      id
      name
      email
      mobile
      postcode
      services {
        id
        serviceType
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const REGISTER_LEAD = gql`
  mutation RegisterLead($input: RegisterLeadInput!) {
    register(input: $input) {
      id
      name
      email
      mobile
      postcode
      services {
        id
        serviceType
        createdAt
      }
      createdAt
    }
  }
`;

