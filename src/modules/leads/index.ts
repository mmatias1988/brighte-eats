/**
 * Public API exports for the leads module
 */

// GraphQL Schema
export { leadTypeDefs } from './typeDefs.js';

// GraphQL Resolvers
export { leadResolvers } from './resolvers.js';

// Service
export { LeadService, leadService } from './lead.service.js';

// Types
export type {
  CreateLeadInput,
  LeadWithServices,
  LeadServiceSelection,
  GetLeadsOptions,
} from './types.js';

// Errors
export {
  LeadError,
  LeadValidationError,
  LeadNotFoundError,
  DuplicateEmailError,
} from './errors.js';

