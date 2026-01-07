import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LeadService } from '../lead.service.js';
import {
  LeadValidationError,
  LeadNotFoundError,
  DuplicateEmailError,
} from '../errors.js';
import { ServiceType } from '@prisma/client';
import type { CreateLeadInput, LeadWithServices } from '../types.js';
import type { LeadRepository } from '../lead.repository.js';

describe('LeadService', () => {
  let leadService: LeadService;
  let mockRepository: {
    create: ReturnType<typeof jest.fn>;
    findAll: ReturnType<typeof jest.fn>;
    findById: ReturnType<typeof jest.fn>;
    findByEmail: ReturnType<typeof jest.fn>;
    count: ReturnType<typeof jest.fn>;
  };

  beforeEach(() => {
    // Create a fresh mock repository for each test
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      count: jest.fn(),
    };

    // Create service with mocked repository
    leadService = new LeadService(undefined as any);
    (leadService as any).repository = mockRepository;
  });

  describe('createLead', () => {
    const validInput: CreateLeadInput = {
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

    it('should create a lead successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockCreatedLead);

      const result = await leadService.createLead(validInput);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
      expect(mockRepository.create).toHaveBeenCalledWith(validInput);
      expect(result).toEqual(mockCreatedLead);
    });

    it('should throw DuplicateEmailError if email already exists', async () => {
      const existingLead: LeadWithServices = {
        id: 'existing-123',
        name: 'Existing User',
        email: 'john@example.com',
        mobile: '0498765432',
        postcode: '3000',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        services: [],
      };

      mockRepository.findByEmail.mockResolvedValue(existingLead);

      await expect(leadService.createLead(validInput)).rejects.toThrow(
        DuplicateEmailError
      );
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should validate input before creating', async () => {
      const invalidInput: CreateLeadInput = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a valid email
        mobile: '123', // Invalid: too short
        postcode: '12', // Invalid: too short
        services: [], // Invalid: empty services
      };

      await expect(leadService.createLead(invalidInput)).rejects.toThrow(
        LeadValidationError
      );
      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should sanitize input (trim and lowercase email)', async () => {
      const inputWithWhitespace: CreateLeadInput = {
        name: '  John Doe  ',
        email: 'JOHN@EXAMPLE.COM', // Email validated before trimming, so no spaces
        mobile: '  0412345678  ',
        postcode: '  2000  ',
        services: [ServiceType.DELIVERY],
      };

      const expectedSanitized: CreateLeadInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: [ServiceType.DELIVERY],
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockCreatedLead);

      await leadService.createLead(inputWithWhitespace);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expectedSanitized
      );
    });
  });

  describe('getLeads', () => {
    it('should return all leads', async () => {
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

      mockRepository.findAll.mockResolvedValue(mockLeads);

      const result = await leadService.getLeads();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockLeads);
    });

    it('should pass options to repository', async () => {
      const options = {
        limit: 10,
        offset: 0,
        orderBy: 'createdAt' as const,
        orderDirection: 'desc' as const,
      };

      mockRepository.findAll.mockResolvedValue([]);

      await leadService.getLeads(options);

      expect(mockRepository.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('getLeadById', () => {
    it('should return lead when found', async () => {
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

      mockRepository.findById.mockResolvedValue(mockLead);

      const result = await leadService.getLeadById('lead-123');

      expect(mockRepository.findById).toHaveBeenCalledWith('lead-123');
      expect(result).toEqual(mockLead);
    });

    it('should throw LeadNotFoundError when lead not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(leadService.getLeadById('non-existent')).rejects.toThrow(
        LeadNotFoundError
      );
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findLeadById', () => {
    it('should return lead when found', async () => {
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

      mockRepository.findById.mockResolvedValue(mockLead);

      const result = await leadService.findLeadById('lead-123');

      expect(result).toEqual(mockLead);
    });

    it('should return null when lead not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await leadService.findLeadById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getLeadCount', () => {
    it('should return count from repository', async () => {
      mockRepository.count.mockResolvedValue(42);

      const result = await leadService.getLeadCount();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });
});

