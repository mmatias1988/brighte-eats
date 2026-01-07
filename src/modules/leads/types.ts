import { ServiceType } from '@prisma/client';

/**
 * Input type for creating a new lead
 */
export interface CreateLeadInput {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceType[];
}

/**
 * Service selection with metadata
 */
export interface LeadServiceSelection {
  id: string;
  serviceType: ServiceType;
  createdAt: Date;
}

/**
 * Lead entity with associated services
 */
export interface LeadWithServices {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  createdAt: Date;
  updatedAt: Date;
  services: LeadServiceSelection[];
}

/**
 * Options for querying leads
 */
export interface GetLeadsOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'name' | 'email';
  orderDirection?: 'asc' | 'desc';
}

