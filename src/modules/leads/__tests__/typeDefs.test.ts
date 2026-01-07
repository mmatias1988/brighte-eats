import { describe, it, expect } from '@jest/globals';
import { leadTypeDefs } from '../typeDefs.js';
import { buildSchema } from 'graphql';

describe('leadTypeDefs', () => {
  it('should export a string', () => {
    expect(typeof leadTypeDefs).toBe('string');
    expect(leadTypeDefs.length).toBeGreaterThan(0);
  });

  it('should be a valid GraphQL schema', () => {
    // Should not throw when building schema
    expect(() => {
      buildSchema(leadTypeDefs);
    }).not.toThrow();
  });

  it('should contain Service enum', () => {
    expect(leadTypeDefs).toContain('enum Service');
    expect(leadTypeDefs).toContain('DELIVERY');
    expect(leadTypeDefs).toContain('PICKUP');
    expect(leadTypeDefs).toContain('PAYMENT');
  });

  it('should contain LeadService type', () => {
    expect(leadTypeDefs).toContain('type LeadService');
    expect(leadTypeDefs).toContain('id: ID!');
    expect(leadTypeDefs).toContain('serviceType: Service!');
    expect(leadTypeDefs).toContain('createdAt: DateTime!');
  });

  it('should contain Lead type', () => {
    expect(leadTypeDefs).toContain('type Lead');
    expect(leadTypeDefs).toContain('name: String!');
    expect(leadTypeDefs).toContain('email: String!');
    expect(leadTypeDefs).toContain('mobile: String!');
    expect(leadTypeDefs).toContain('postcode: String!');
    expect(leadTypeDefs).toContain('services: [LeadService!]!');
    expect(leadTypeDefs).toContain('createdAt: DateTime!');
    expect(leadTypeDefs).toContain('updatedAt: DateTime!');
  });

  it('should contain RegisterLeadInput input type', () => {
    expect(leadTypeDefs).toContain('input RegisterLeadInput');
    expect(leadTypeDefs).toContain('name: String!');
    expect(leadTypeDefs).toContain('email: String!');
    expect(leadTypeDefs).toContain('mobile: String!');
    expect(leadTypeDefs).toContain('postcode: String!');
    expect(leadTypeDefs).toContain('services: [Service!]!');
  });

  it('should contain Query type with leads and lead', () => {
    expect(leadTypeDefs).toContain('type Query');
    expect(leadTypeDefs).toContain('leads: [Lead!]!');
    expect(leadTypeDefs).toContain('lead(id: ID!): Lead');
  });

  it('should contain Mutation type with register', () => {
    expect(leadTypeDefs).toContain('type Mutation');
    expect(leadTypeDefs).toContain('register(input: RegisterLeadInput!): Lead!');
  });

  it('should contain DateTime scalar', () => {
    expect(leadTypeDefs).toContain('scalar DateTime');
  });

  it('should have proper GraphQL syntax with #graphql tag', () => {
    expect(leadTypeDefs).toContain('#graphql');
  });

  it('should have all required descriptions', () => {
    // Check for description markers
    expect(leadTypeDefs).toContain('""');
    
    // Key descriptions
    expect(leadTypeDefs).toContain('Service types available for Brighte Eats');
    expect(leadTypeDefs).toContain('Retrieve all leads with their services');
    expect(leadTypeDefs).toContain('Register a new lead with their service interests');
  });

  describe('schema structure validation', () => {
    let schema: any;

    beforeEach(() => {
      schema = buildSchema(leadTypeDefs);
    });

    it('should have Service enum with correct values', () => {
      const serviceType = schema.getType('Service');
      expect(serviceType).toBeDefined();
      expect(serviceType.getValues().map((v: any) => v.value)).toEqual([
        'DELIVERY',
        'PICKUP',
        'PAYMENT',
      ]);
    });

    it('should have LeadService type with correct fields', () => {
      const leadServiceType = schema.getType('LeadService');
      expect(leadServiceType).toBeDefined();
      const fields = leadServiceType.getFields();
      expect(fields.id).toBeDefined();
      expect(fields.serviceType).toBeDefined();
      expect(fields.createdAt).toBeDefined();
    });

    it('should have Lead type with correct fields', () => {
      const leadType = schema.getType('Lead');
      expect(leadType).toBeDefined();
      const fields = leadType.getFields();
      expect(fields.id).toBeDefined();
      expect(fields.name).toBeDefined();
      expect(fields.email).toBeDefined();
      expect(fields.mobile).toBeDefined();
      expect(fields.postcode).toBeDefined();
      expect(fields.services).toBeDefined();
      expect(fields.createdAt).toBeDefined();
      expect(fields.updatedAt).toBeDefined();
    });

    it('should have RegisterLeadInput input type', () => {
      const inputType = schema.getType('RegisterLeadInput');
      expect(inputType).toBeDefined();
    });

    it('should have Query type with correct fields', () => {
      const queryType = schema.getQueryType();
      expect(queryType).toBeDefined();
      const fields = queryType.getFields();
      expect(fields.leads).toBeDefined();
      expect(fields.lead).toBeDefined();
    });

    it('should have Mutation type with register field', () => {
      const mutationType = schema.getMutationType();
      expect(mutationType).toBeDefined();
      const fields = mutationType.getFields();
      expect(fields.register).toBeDefined();
    });

    it('should have DateTime scalar', () => {
      const dateTimeType = schema.getType('DateTime');
      expect(dateTimeType).toBeDefined();
    });
  });
});

