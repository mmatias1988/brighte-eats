import { PrismaClient, ServiceType } from '@prisma/client';
import type { LeadWithServices, GetLeadsOptions } from './types.js';

/**
 * Service selection fields for queries
 */
const SERVICE_SELECT = {
  id: true,
  serviceType: true,
  createdAt: true,
} as const;

/**
 * Data access layer for Lead operations
 */
export class LeadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new lead with services
   */
  async create(
    data: {
      name: string;
      email: string;
      mobile: string;
      postcode: string;
      services: ServiceType[];
    }
  ): Promise<LeadWithServices> {
    return this.prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        postcode: data.postcode,
        services: {
          create: data.services.map((serviceType) => ({
            serviceType,
          })),
        },
      },
      include: {
        services: {
          select: SERVICE_SELECT,
        },
      },
    });
  }

  /**
   * Finds a lead by ID
   */
  async findById(id: string): Promise<LeadWithServices | null> {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        services: {
          select: SERVICE_SELECT,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  /**
   * Finds a lead by email
   */
  async findByEmail(email: string): Promise<LeadWithServices | null> {
    return this.prisma.lead.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        services: {
          select: SERVICE_SELECT,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  /**
   * Finds all leads with pagination and sorting
   */
  async findAll(options: GetLeadsOptions = {}): Promise<LeadWithServices[]> {
    const {
      limit,
      offset = 0,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const result = await this.prisma.lead.findMany({
      include: {
        services: {
          select: SERVICE_SELECT,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        [orderBy]: orderDirection,
      } as Record<string, 'asc' | 'desc'>,
      ...(limit !== undefined && { take: limit }),
      skip: offset,
    });

    return result as LeadWithServices[];
  }

  /**
   * Counts total number of leads
   */
  async count(): Promise<number> {
    return this.prisma.lead.count();
  }
}

