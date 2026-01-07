import { GraphQLError } from 'graphql';
import { ServiceType } from '@prisma/client';
import { leadService } from './lead.service.js';
import { LeadValidationError, LeadNotFoundError, DuplicateEmailError } from './errors.js';
import type { CreateLeadInput } from './types.js';

/**
 * Map GraphQL Service enum to Prisma ServiceType
 */
function mapServiceType(service: string): ServiceType {
  switch (service) {
    case 'DELIVERY':
      return ServiceType.DELIVERY;
    case 'PICKUP':
      return ServiceType.PICKUP;
    case 'PAYMENT':
      return ServiceType.PAYMENT;
    default:
      throw new GraphQLError(`Invalid service type: ${service}`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
  }
}

/**
 * GraphQL resolvers for Lead operations
 */
export const leadResolvers = {
  Query: {
    /**
     * Retrieve all leads with their services
     */
    leads: async () => {
      try {
        return await leadService.getLeads();
      } catch (error) {
        throw new GraphQLError('Failed to retrieve leads', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
          originalError: error as Error,
        });
      }
    },

    /**
     * Retrieve a single lead by ID with their services
     */
    lead: async (_: unknown, args: { id: string }) => {
      try {
        return await leadService.findLeadById(args.id);
      } catch (error) {
        if (error instanceof LeadNotFoundError) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        throw new GraphQLError('Failed to retrieve lead', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
          originalError: error as Error,
        });
      }
    },
  },

  Mutation: {
    /**
     * Register a new lead with their service interests
     */
    register: async (_: unknown, args: { input: RegisterLeadInput }) => {
      try {
        // Map GraphQL input to service input
        const input: CreateLeadInput = {
          name: args.input.name,
          email: args.input.email,
          mobile: args.input.mobile,
          postcode: args.input.postcode,
          services: args.input.services.map(mapServiceType),
        };

        // Create lead via service layer
        return await leadService.createLead(input);
      } catch (error) {
        if (error instanceof LeadValidationError) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        if (error instanceof DuplicateEmailError) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        throw new GraphQLError('Failed to register lead', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
          originalError: error as Error,
        });
      }
    },
  },

  /**
   * DateTime scalar resolver
   * Converts Date objects to ISO 8601 strings for GraphQL
   */
  DateTime: {
    serialize: (value: Date): string => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return new Date(value as string | number).toISOString();
    },
    parseValue: (value: string): Date => new Date(value),
    parseLiteral: (ast: any): Date | null => {
      if (ast.kind === 'StringValue') {
        return new Date(ast.value);
      }
      return null;
    },
  },
};

/**
 * GraphQL input type for register mutation
 */
interface RegisterLeadInput {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[];
}

