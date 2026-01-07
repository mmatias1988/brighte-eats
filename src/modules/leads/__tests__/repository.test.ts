import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LeadRepository } from '../repository.js';
import { ServiceType } from '@prisma/client';
import type { LeadWithServices } from '../types.js';
import type { PrismaClient } from '@prisma/client';

describe('LeadRepository', () => {
  let repository: LeadRepository;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    // Create mock Prisma client
    mockPrisma = {
      lead: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    repository = new LeadRepository(mockPrisma as any);
  });

  describe('create', () => {
    const createData = {
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '0412345678',
      postcode: '2000',
      services: [ServiceType.DELIVERY, ServiceType.PICKUP],
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

    it('should create a lead with services', async () => {
      mockPrisma.lead.create.mockResolvedValue(mockCreatedLead as any);

      const result = await repository.create(createData);

      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: {
          name: createData.name,
          email: createData.email,
          mobile: createData.mobile,
          postcode: createData.postcode,
          services: {
            create: [
              { serviceType: ServiceType.DELIVERY },
              { serviceType: ServiceType.PICKUP },
            ],
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
      expect(result).toEqual(mockCreatedLead);
    });

    it('should create a lead with single service', async () => {
      const singleServiceData = {
        ...createData,
        services: [ServiceType.PAYMENT],
      };

      const singleServiceLead: LeadWithServices = {
        ...mockCreatedLead,
        services: [
          {
            id: 'service-3',
            serviceType: ServiceType.PAYMENT,
            createdAt: new Date('2024-01-01'),
          },
        ],
      };

      mockPrisma.lead.create.mockResolvedValue(singleServiceLead as any);

      const result = await repository.create(singleServiceData);

      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: {
          name: singleServiceData.name,
          email: singleServiceData.email,
          mobile: singleServiceData.mobile,
          postcode: singleServiceData.postcode,
          services: {
            create: [{ serviceType: ServiceType.PAYMENT }],
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
      expect(result).toEqual(singleServiceLead);
    });
  });

  describe('findById', () => {
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

    it('should find a lead by ID', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(mockLead as any);

      const result = await repository.findById('lead-123');

      expect(mockPrisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
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
      expect(result).toEqual(mockLead);
    });

    it('should return null when lead not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
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

    it('should find a lead by email (lowercase)', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(mockLead as any);

      const result = await repository.findByEmail('JOHN@EXAMPLE.COM');

      expect(mockPrisma.lead.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
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
      expect(result).toEqual(mockLead);
    });

    it('should return null when lead not found by email', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
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
      {
        id: 'lead-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '0498765432',
        postcode: '3000',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        services: [],
      },
    ];

    it('should find all leads with default options', async () => {
      mockPrisma.lead.findMany.mockResolvedValue(mockLeads as any);

      const result = await repository.findAll();

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
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
        skip: 0,
      });
      expect(result).toEqual(mockLeads);
    });

    it('should find all leads with custom options', async () => {
      const options = {
        limit: 10,
        offset: 5,
        orderBy: 'name' as const,
        orderDirection: 'asc' as const,
      };

      mockPrisma.lead.findMany.mockResolvedValue(mockLeads as any);

      const result = await repository.findAll(options);

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
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
          name: 'asc',
        },
        take: 10,
        skip: 5,
      });
      expect(result).toEqual(mockLeads);
    });

    it('should find all leads without limit', async () => {
      const options = {
        offset: 2,
        orderBy: 'email' as const,
        orderDirection: 'desc' as const,
      };

      mockPrisma.lead.findMany.mockResolvedValue(mockLeads as any);

      await repository.findAll(options);

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
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
          email: 'desc',
        },
        skip: 2,
      });
    });

    it('should return empty array when no leads found', async () => {
      mockPrisma.lead.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('count', () => {
    it('should return count of leads', async () => {
      mockPrisma.lead.count.mockResolvedValue(42);

      const result = await repository.count();

      expect(mockPrisma.lead.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it('should return zero when no leads exist', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);

      const result = await repository.count();

      expect(result).toBe(0);
    });
  });
});

