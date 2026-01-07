/**
 * Base error class for lead-related errors
 */
export class LeadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when lead validation fails
 */
export class LeadValidationError extends LeadError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when a lead is not found
 */
export class LeadNotFoundError extends LeadError {
  constructor(id: string) {
    super(`Lead with id ${id} not found`);
  }
}

/**
 * Error thrown when a lead with the same email already exists
 */
export class DuplicateEmailError extends LeadError {
  constructor(email: string) {
    super(`A lead with email ${email} already exists`);
  }
}

