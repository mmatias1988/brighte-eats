import { describe, it, expect } from '@jest/globals';
import { LeadValidator } from '../lead.validator.js';
import { LeadValidationError } from '../errors.js';
import { ServiceType } from '@prisma/client';

describe('LeadValidator', () => {
  describe('validateCreateInput', () => {
    it('should validate and return sanitized input for valid data', () => {
      const input = {
        name: '  John Doe  ',
        email: 'John.Doe@Example.com', // Email validated before trimming, so no spaces
        mobile: '  0412345678  ',
        postcode: '  2000  ',
        services: [ServiceType.DELIVERY, ServiceType.PICKUP],
      };

      const result = LeadValidator.validateCreateInput(input);

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: [ServiceType.DELIVERY, ServiceType.PICKUP],
      });
    });

    describe('name validation', () => {
      it('should throw error if name is empty', () => {
        const input = {
          name: '',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          LeadValidationError
        );
        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Name is required'
        );
      });

      it('should throw error if name is only whitespace', () => {
        const input = {
          name: '   ',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Name is required'
        );
      });

      it('should throw error if name is too short', () => {
        const input = {
          name: 'A',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Name must be at least 2 characters long'
        );
      });

      it('should throw error if name is too long', () => {
        const input = {
          name: 'A'.repeat(101),
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Name must be less than 100 characters'
        );
      });
    });

    describe('email validation', () => {
      it('should throw error for invalid email format', () => {
        const invalidEmails = [
          'invalid',
          '@example.com',
          'test@',
          'test.example.com',
          'test @example.com',
        ];

        invalidEmails.forEach((email) => {
          const input = {
            name: 'John Doe',
            email,
            mobile: '0412345678',
            postcode: '2000',
            services: [ServiceType.DELIVERY],
          };

          expect(() => LeadValidator.validateCreateInput(input)).toThrow(
            'Invalid email format'
          );
        });
      });

      it('should accept valid email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@example.com',
          'user+tag@example.co.uk',
        ];

        validEmails.forEach((email) => {
          const input = {
            name: 'John Doe',
            email,
            mobile: '0412345678',
            postcode: '2000',
            services: [ServiceType.DELIVERY],
          };

          expect(() =>
            LeadValidator.validateCreateInput(input)
          ).not.toThrow();
        });
      });

      it('should convert email to lowercase', () => {
        const input = {
          name: 'John Doe',
          email: 'John.Doe@EXAMPLE.COM',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY],
        };

        const result = LeadValidator.validateCreateInput(input);
        expect(result.email).toBe('john.doe@example.com');
      });
    });

    describe('mobile validation', () => {
      it('should throw error for invalid mobile format', () => {
        const invalidMobiles = ['123', 'abcdefgh', '1234567890123456', ''];

        invalidMobiles.forEach((mobile) => {
          const input = {
            name: 'John Doe',
            email: 'test@example.com',
            mobile,
            postcode: '2000',
            services: [ServiceType.DELIVERY],
          };

          expect(() => LeadValidator.validateCreateInput(input)).toThrow(
            'Invalid mobile number format'
          );
        });
      });

      it('should accept valid mobile numbers with formatting', () => {
        const validMobiles = [
          '0412345678',
          '04 1234 5678',
          '04-1234-5678',
          '(04) 1234 5678',
          '04123456789',
        ];

        validMobiles.forEach((mobile) => {
          const input = {
            name: 'John Doe',
            email: 'test@example.com',
            mobile,
            postcode: '2000',
            services: [ServiceType.DELIVERY],
          };

          expect(() =>
            LeadValidator.validateCreateInput(input)
          ).not.toThrow();
        });
      });
    });

    describe('postcode validation', () => {
      it('should throw error if postcode is empty', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Postcode is required'
        );
      });

      it('should throw error if postcode is too short', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '123',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Postcode must be between 4 and 10 characters'
        );
      });

      it('should throw error if postcode is too long', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '12345678901',
          services: [ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Postcode must be between 4 and 10 characters'
        );
      });
    });

    describe('services validation', () => {
      it('should throw error if services array is empty', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'At least one service must be selected'
        );
      });

      it('should throw error for duplicate services', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [ServiceType.DELIVERY, ServiceType.DELIVERY],
        };

        expect(() => LeadValidator.validateCreateInput(input)).toThrow(
          'Duplicate services are not allowed'
        );
      });

      it('should accept valid service types', () => {
        const input = {
          name: 'John Doe',
          email: 'test@example.com',
          mobile: '0412345678',
          postcode: '2000',
          services: [
            ServiceType.DELIVERY,
            ServiceType.PICKUP,
            ServiceType.PAYMENT,
          ],
        };

        const result = LeadValidator.validateCreateInput(input);
        expect(result.services).toEqual([
          ServiceType.DELIVERY,
          ServiceType.PICKUP,
          ServiceType.PAYMENT,
        ]);
      });
    });
  });
});

