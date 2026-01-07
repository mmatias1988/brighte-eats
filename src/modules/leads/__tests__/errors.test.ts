import { describe, it, expect } from '@jest/globals';
import {
  LeadError,
  LeadValidationError,
  LeadNotFoundError,
  DuplicateEmailError,
} from '../errors.js';

describe('Error Classes', () => {
  describe('LeadError', () => {
    it('should create error with message', () => {
      const error = new LeadError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(LeadError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('LeadError');
    });
  });

  describe('LeadValidationError', () => {
    it('should create validation error', () => {
      const error = new LeadValidationError('Invalid input');

      expect(error).toBeInstanceOf(LeadError);
      expect(error).toBeInstanceOf(LeadValidationError);
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('LeadValidationError');
    });
  });

  describe('LeadNotFoundError', () => {
    it('should create not found error with formatted message', () => {
      const id = 'lead-123';
      const error = new LeadNotFoundError(id);

      expect(error).toBeInstanceOf(LeadError);
      expect(error).toBeInstanceOf(LeadNotFoundError);
      expect(error.message).toBe(`Lead with id ${id} not found`);
      expect(error.name).toBe('LeadNotFoundError');
    });
  });

  describe('DuplicateEmailError', () => {
    it('should create duplicate email error with formatted message', () => {
      const email = 'test@example.com';
      const error = new DuplicateEmailError(email);

      expect(error).toBeInstanceOf(LeadError);
      expect(error).toBeInstanceOf(DuplicateEmailError);
      expect(error.message).toBe(`A lead with email ${email} already exists`);
      expect(error.name).toBe('DuplicateEmailError');
    });
  });
});

