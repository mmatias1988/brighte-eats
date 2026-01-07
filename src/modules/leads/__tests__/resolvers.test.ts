import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GraphQLError } from 'graphql';
import { ServiceType } from '@prisma/client';
import {
  LeadValidationError,
  LeadNotFoundError,
  DuplicateEmailError,
} from '../errors.js';
import type { LeadWithServices } from '../types.js';
import { leadResolvers } from '../resolvers.js';
import * as leadServiceModule from '../service.js';

// Create spies for service methods
const mockGetLeads = jest.spyOn(leadServiceModule.leadService, 'getLeads');
const mockFindLeadById = jest.spyOn(leadServiceModule.leadService, 'findLeadById');
const mockCreateLead = jest.spyOn(leadServiceModule.leadService, 'createLead');

describe('leadResolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query', () => {
    describe('leads', () => {
      const mockLeads: LeadWithServices[] = [
        {
          id: 'lead-1',
          name: 'John Doe',
          email: 'john@example.com',
          mobile: '0412345678',
          postcode: '2000',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          services: [],
        },
      ];

      it('should return all leads', async () => {
        mockGetLeads.mockResolvedValue(mockLeads);

        const result = await leadResolvers.Query.leads();

        expect(mockGetLeads).toHaveBeenCalled();
        expect(result).toEqual(mockLeads);
      });

      it('should throw GraphQLError on service error', async () => {
        const error = new Error('Database connection failed');
        mockGetLeads.mockRejectedValue(error);

        await expect(leadResolvers.Query.leads()).rejects.toThrow(GraphQLError);
        await expect(leadResolvers.Query.leads()).rejects.toThrow(
          'Failed to retrieve leads'
        );
      });
    });

    describe('lead', () => {
      const mockLead: LeadWithServices = {
        id: 'lead-123',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        services: [],
      };

      it('should return lead when found', async () => {
        mockFindLeadById.mockResolvedValue(mockLead);

        const result = await leadResolvers.Query.lead(
          null,
          { id: 'lead-123' },
          {} as any,
          {} as any
        );

        expect(mockFindLeadById).toHaveBeenCalledWith('lead-123');
        expect(result).toEqual(mockLead);
      });

      it('should return null when lead not found', async () => {
        mockFindLeadById.mockResolvedValue(null);

        const result = await leadResolvers.Query.lead(
          null,
          { id: 'non-existent' },
          {} as any,
          {} as any
        );

        expect(result).toBeNull();
      });

      it('should throw GraphQLError with NOT_FOUND code for LeadNotFoundError', async () => {
        const error = new LeadNotFoundError('lead-123');
        mockFindLeadById.mockRejectedValue(error);

        await expect(
          leadResolvers.Query.lead(null, { id: 'lead-123' }, {} as any, {} as any)
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Query.lead(
            null,
            { id: 'lead-123' },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          expect(err.extensions?.code).toBe('NOT_FOUND');
        }
      });

      it('should throw GraphQLError with INTERNAL_SERVER_ERROR for other errors', async () => {
        const error = new Error('Unexpected error');
        mockFindLeadById.mockRejectedValue(error);

        await expect(
          leadResolvers.Query.lead(null, { id: 'lead-123' }, {} as any, {} as any)
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Query.lead(
            null,
            { id: 'lead-123' },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          expect(err.extensions?.code).toBe('INTERNAL_SERVER_ERROR');
        }
      });
    });
  });

  describe('Mutation', () => {
    describe('register', () => {
      const mockInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: ['DELIVERY', 'PICKUP'],
      };

      const mockCreatedLead: LeadWithServices = {
        id: 'lead-123',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        services: [
          {
            id: 'service-1',
            serviceType: ServiceType.DELIVERY,
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'service-2',
            serviceType: ServiceType.PICKUP,
            createdAt: new Date('2024-01-01'),
          },
        ],
      };

      it('should register a lead successfully', async () => {
        mockCreateLead.mockResolvedValue(mockCreatedLead);

        const result = await leadResolvers.Mutation.register(
          null,
          { input: mockInput },
          {} as any,
          {} as any
        );

        expect(mockCreateLead).toHaveBeenCalledWith({
          name: mockInput.name,
          email: mockInput.email,
          mobile: mockInput.mobile,
          postcode: mockInput.postcode,
          services: [ServiceType.DELIVERY, ServiceType.PICKUP],
        });
        expect(result).toEqual(mockCreatedLead);
      });

      it('should map all service types correctly', async () => {
        const inputWithAllServices = {
          ...mockInput,
          services: ['DELIVERY', 'PICKUP', 'PAYMENT'],
        };

        mockCreateLead.mockResolvedValue(mockCreatedLead);

        await leadResolvers.Mutation.register(
          null,
          { input: inputWithAllServices },
          {} as any,
          {} as any
        );

        expect(mockCreateLead).toHaveBeenCalledWith({
          name: inputWithAllServices.name,
          email: inputWithAllServices.email,
          mobile: inputWithAllServices.mobile,
          postcode: inputWithAllServices.postcode,
          services: [
            ServiceType.DELIVERY,
            ServiceType.PICKUP,
            ServiceType.PAYMENT,
          ],
        });
      });

      it('should throw GraphQLError with BAD_USER_INPUT for LeadValidationError', async () => {
        const error = new LeadValidationError('Invalid email format');
        mockCreateLead.mockRejectedValue(error);

        await expect(
          leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          )
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          expect(err.extensions?.code).toBe('BAD_USER_INPUT');
          expect(err.message).toBe('Invalid email format');
        }
      });

      it('should throw GraphQLError with BAD_USER_INPUT for DuplicateEmailError', async () => {
        const error = new DuplicateEmailError('john@example.com');
        mockCreateLead.mockRejectedValue(error);

        await expect(
          leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          )
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          expect(err.extensions?.code).toBe('BAD_USER_INPUT');
        }
      });

      it('should throw GraphQLError with INTERNAL_SERVER_ERROR for other errors', async () => {
        const error = new Error('Database error');
        mockCreateLead.mockRejectedValue(error);

        await expect(
          leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          )
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Mutation.register(
            null,
            { input: mockInput },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          expect(err.extensions?.code).toBe('INTERNAL_SERVER_ERROR');
        }
      });

      it('should throw GraphQLError for invalid service type', async () => {
        const invalidInput = {
          ...mockInput,
          services: ['INVALID_SERVICE'],
        };

        // The GraphQLError from mapServiceType is caught and wrapped
        // as INTERNAL_SERVER_ERROR (since GraphQLError is not LeadValidationError or DuplicateEmailError)
        await expect(
          leadResolvers.Mutation.register(
            null,
            { input: invalidInput },
            {} as any,
            {} as any
          )
        ).rejects.toThrow(GraphQLError);

        try {
          await leadResolvers.Mutation.register(
            null,
            { input: invalidInput },
            {} as any,
            {} as any
          );
        } catch (err: any) {
          // The original GraphQLError from mapServiceType gets caught
          // and wrapped with "Failed to register lead" message
          // The original error is in originalError
          expect(err.extensions?.code).toBe('INTERNAL_SERVER_ERROR');
          expect(err.originalError?.message).toContain('Invalid service type');
        }
      });
    });
  });

  describe('DateTime', () => {
    describe('serialize', () => {
      it('should serialize Date to ISO string', () => {
        const date = new Date('2024-01-01T12:00:00Z');
        const result = leadResolvers.DateTime.serialize(date);

        expect(result).toBe('2024-01-01T12:00:00.000Z');
      });

      it('should serialize string to ISO string', () => {
        const dateString = '2024-01-01T12:00:00Z';
        const result = leadResolvers.DateTime.serialize(dateString as any);

        expect(result).toBe('2024-01-01T12:00:00.000Z');
      });

      it('should serialize number to ISO string', () => {
        const timestamp = new Date('2024-01-01T12:00:00Z').getTime();
        const result = leadResolvers.DateTime.serialize(timestamp as any);

        expect(result).toBe('2024-01-01T12:00:00.000Z');
      });
    });

    describe('parseValue', () => {
      it('should parse ISO string to Date', () => {
        const dateString = '2024-01-01T12:00:00.000Z';
        const result = leadResolvers.DateTime.parseValue(dateString);

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe(dateString);
      });
    });

    describe('parseLiteral', () => {
      it('should parse StringValue AST node to Date', () => {
        const ast = {
          kind: 'StringValue',
          value: '2024-01-01T12:00:00.000Z',
        };

        const result = leadResolvers.DateTime.parseLiteral(ast);

        expect(result).toBeInstanceOf(Date);
        expect(result?.toISOString()).toBe('2024-01-01T12:00:00.000Z');
      });

      it('should return null for non-StringValue AST nodes', () => {
        const ast = {
          kind: 'IntValue',
          value: 123,
        };

        const result = leadResolvers.DateTime.parseLiteral(ast);

        expect(result).toBeNull();
      });
    });
  });
});

