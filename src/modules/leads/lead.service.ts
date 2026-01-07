import { prisma } from '../../lib/prisma.js';
import { ServiceType } from '@prisma/client';

export interface CreateLeadInput {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceType[];
}

export interface LeadWithServices {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  createdAt: Date;
  updatedAt: Date;
  services: {
    id: string;
    serviceType: ServiceType;
    createdAt: Date;
  }[];
}

export class LeadService {
  /**
   * Creates a new lead with associated services
   */
  async createLead(input: CreateLeadInput): Promise<LeadWithServices> {
    const { name, email, mobile, postcode, services } = input;

    // Services array should not be empty
    if (!services || services.length === 0) {
      throw new Error('At least one service must be selected');
    }

    // Services should be unique
    const uniqueServices = Array.from(new Set(services));
    if (uniqueServices.length !== services.length) {
      throw new Error('Duplicate services are not allowed');
    }

    // Create lead with services
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        mobile,
        postcode,
        services: {
          create: uniqueServices.map((serviceType) => ({
            serviceType,
          })),
        },
      },
      include: {
        services: {
          select: {
            id: true,
            serviceType: true,
            createdAt: true,
          },
        },
      },
    });

    return lead;
  }

  /**
   * Retrieves all leads with their services
   */
  async getLeads(): Promise<LeadWithServices[]> {
    const leads = await prisma.lead.findMany({
      include: {
        services: {
          select: {
            id: true,
            serviceType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leads;
  }

  /**
   * Retrieves a single lead by ID with their services
   */
  async getLeadById(id: string): Promise<LeadWithServices | null> {
    const lead = await prisma.lead.findUnique({
      where: {
        id,
      },
      include: {
        services: {
          select: {
            id: true,
            serviceType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return lead;
  }
}

export const leadService = new LeadService();

