import { PrismaClient } from '@prisma/client';
import type { CreateLeadInput, LeadWithServices, GetLeadsOptions } from './types.js';
import { LeadValidator } from './lead.validator.js';
import { LeadRepository } from './lead.repository.js';
import { LeadNotFoundError, DuplicateEmailError } from './errors.js';
import { prisma } from '../../lib/prisma.js';

/**
 * Business logic layer for Lead operations
 */
export class LeadService {
  private readonly repository: LeadRepository;

  constructor(client: PrismaClient = prisma) {
    this.repository = new LeadRepository(client);
  }

  /**
   * Creates a new lead with associated services
   * @throws {LeadValidationError} When input validation fails
   * @throws {DuplicateEmailError} When email already exists
   */
  async createLead(input: CreateLeadInput): Promise<LeadWithServices> {
    // Validate input
    const validatedInput = LeadValidator.validateCreateInput(input);

    // Check for duplicate email
    const existingLead = await this.repository.findByEmail(validatedInput.email);
    if (existingLead) {
      throw new DuplicateEmailError(validatedInput.email);
    }

    // Create lead
    return this.repository.create({
      name: validatedInput.name,
      email: validatedInput.email,
      mobile: validatedInput.mobile,
      postcode: validatedInput.postcode,
      services: validatedInput.services,
    });
  }

  /**
   * Retrieves all leads with their services
   */
  async getLeads(options?: GetLeadsOptions): Promise<LeadWithServices[]> {
    return this.repository.findAll(options);
  }

  /**
   * Retrieves a single lead by ID with their services
   * @throws {LeadNotFoundError} When lead is not found
   * Should exist but not found
   */
  async getLeadById(id: string): Promise<LeadWithServices> {
    const lead = await this.repository.findById(id);
    if (!lead) {
      throw new LeadNotFoundError(id);
    }
    return lead;
  }

  /**
   * Retrieves a single lead by ID with their services (returns null if not found)
   * Might not exist 
   */
  async findLeadById(id: string): Promise<LeadWithServices | null> {
    return this.repository.findById(id);
  }

  /**
   * Gets total count of leads
   */
  async getLeadCount(): Promise<number> {
    return this.repository.count();
  }
}

// Export singleton instance
export const leadService = new LeadService();
