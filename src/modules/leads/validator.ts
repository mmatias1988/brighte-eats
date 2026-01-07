import { ServiceType } from '@prisma/client';
import type { CreateLeadInput } from './types.js';
import { LeadValidationError } from './errors.js';

/**
 * Validates lead creation input
 */
export class LeadValidator {
  /**
   * Validates email format
   */
  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new LeadValidationError('Invalid email format');
    }
  }

  /**
   * Validates mobile number format (basic validation)
   */
  private static validateMobile(mobile: string): void {
    // Remove spaces and common formatting
    const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
    // Check if it's a valid phone number (digits only, reasonable length)
    if (!/^\d{8,15}$/.test(cleaned)) {
      throw new LeadValidationError('Invalid mobile number format');
    }
  }

  /**
   * Validates postcode format (basic validation)
   */
  private static validatePostcode(postcode: string): void {
    if (!postcode || postcode.trim().length === 0) {
      throw new LeadValidationError('Postcode is required');
    }
    if (postcode.length < 4 || postcode.length > 10) {
      throw new LeadValidationError('Postcode must be between 4 and 10 characters');
    }
  }

  /**
   * Validates services array
   */
  private static validateServices(services: ServiceType[]): ServiceType[] {
    if (!services || services.length === 0) {
      throw new LeadValidationError('At least one service must be selected');
    }

    // Remove duplicates
    const uniqueServices = Array.from(new Set(services));
    if (uniqueServices.length !== services.length) {
      throw new LeadValidationError('Duplicate services are not allowed');
    }

    // Validate each service is a valid enum value
    const validServices: ServiceType[] = ['DELIVERY', 'PICKUP', 'PAYMENT'];
    for (const service of uniqueServices) {
      if (!validServices.includes(service)) {
        throw new LeadValidationError(`Invalid service type: ${service}`);
      }
    }

    return uniqueServices;
  }

  /**
   * Validates name field
   */
  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new LeadValidationError('Name is required');
    }
    if (name.trim().length < 2) {
      throw new LeadValidationError('Name must be at least 2 characters long');
    }
    if (name.length > 100) {
      throw new LeadValidationError('Name must be less than 100 characters');
    }
  }

  /**
   * Validates complete lead input
   */
  static validateCreateInput(input: CreateLeadInput): CreateLeadInput {
    this.validateName(input.name);
    this.validateEmail(input.email);
    this.validateMobile(input.mobile);
    this.validatePostcode(input.postcode);
    const validatedServices = this.validateServices(input.services);

    return {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      mobile: input.mobile.trim(),
      postcode: input.postcode.trim(),
      services: validatedServices,
    };
  }
}

