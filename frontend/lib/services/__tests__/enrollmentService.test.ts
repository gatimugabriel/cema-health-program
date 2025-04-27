import { describe, it, expect, vi, beforeEach } from 'vitest';
import enrollmentService, { CreateEnrollmentDto, UpdateEnrollmentDto } from '../enrollment.service';
import { API_ENDPOINTS } from '@/lib/constants/api';

// Mock fetch
global.fetch = vi.fn();

describe('Enrollment Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getEnrollments', () => {
    it('should fetch all enrollments', async () => {
      const mockEnrollments = {
        data: [
          {
            id: '1',
            clientID: '1',
            programID: '1',
            programName: 'Program 1',
            status: 'active',
            enrollmentDate: '2023-01-01',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            program: { name: 'Program 1' }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnrollments
      });

      const result = await enrollmentService.getEnrollments();

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.ENROLLMENTS);
      expect(result).toEqual(mockEnrollments.data);
    });

    it('should handle errors when fetching enrollments', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(enrollmentService.getEnrollments()).rejects.toThrow('Error fetching enrollments: 500');
    });
  });

  describe('getEnrollmentById', () => {
    it('should fetch an enrollment by ID', async () => {
      const mockEnrollment = {
        data: {
          id: '1',
          clientID: '1',
          programID: '1',
          programName: 'Program 1',
          status: 'active',
          enrollmentDate: '2023-01-01',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          program: { name: 'Program 1' }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnrollment
      });

      const result = await enrollmentService.getEnrollmentById('1');

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.ENROLLMENT('1'));
      expect(result).toEqual(mockEnrollment.data);
    });

    it('should handle errors when fetching an enrollment by ID', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(enrollmentService.getEnrollmentById('1')).rejects.toThrow('Error fetching enrollment: 404');
    });
  });

  describe('createEnrollment', () => {
    it('should create a new enrollment', async () => {
      const enrollmentData: CreateEnrollmentDto = {
        clientId: '1',
        programId: '1',
        enrollmentDate: '2023-01-01',
        status: 'active'
      };

      const mockResponse = {
        data: {
          id: '1',
          clientID: '1',
          programID: '1',
          programName: 'Program 1',
          status: 'active',
          enrollmentDate: '2023-01-01',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          program: { name: 'Program 1' }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await enrollmentService.createEnrollment(enrollmentData);

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.ENROLLMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrollmentData)
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating an enrollment', async () => {
      const enrollmentData: CreateEnrollmentDto = {
        clientId: '1',
        programId: '1',
        enrollmentDate: '2023-01-01',
        status: 'active'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid data' })
      });

      await expect(enrollmentService.createEnrollment(enrollmentData)).rejects.toThrow('Invalid data');
    });
  });

  describe('updateEnrollment', () => {
    it('should update an existing enrollment', async () => {
      const enrollmentData: UpdateEnrollmentDto = {
        status: 'completed',
        exitDate: '2023-02-01'
      };

      const mockResponse = {
        data: {
          id: '1',
          clientID: '1',
          programID: '1',
          programName: 'Program 1',
          status: 'completed',
          enrollmentDate: '2023-01-01',
          exitDate: '2023-02-01',
          createdAt: '2023-01-01',
          updatedAt: '2023-02-01',
          program: { name: 'Program 1' }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await enrollmentService.updateEnrollment('1', enrollmentData);

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.ENROLLMENT('1'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrollmentData)
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when updating an enrollment', async () => {
      const enrollmentData: UpdateEnrollmentDto = {
        status: 'completed'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid data' })
      });

      await expect(enrollmentService.updateEnrollment('1', enrollmentData)).rejects.toThrow('Invalid data');
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete an enrollment', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true
      });

      await enrollmentService.deleteEnrollment('1');

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.ENROLLMENT('1'), {
        method: 'DELETE'
      });
    });

    it('should handle errors when deleting an enrollment', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(enrollmentService.deleteEnrollment('1')).rejects.toThrow('Error deleting enrollment: 404');
    });
  });

  describe('getClientEnrollments', () => {
    it('should fetch enrollments for a client', async () => {
      const mockEnrollments = {
        data: [
          {
            id: '1',
            clientID: '1',
            programID: '1',
            programName: 'Program 1',
            status: 'active',
            enrollmentDate: '2023-01-01',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            program: { name: 'Program 1' }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnrollments
      });

      const result = await enrollmentService.getClientEnrollments('1');

      expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.CLIENT_ENROLLMENTS('1'));
      expect(result).toEqual(mockEnrollments.data);
    });

    it('should handle errors when fetching client enrollments', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(enrollmentService.getClientEnrollments('1')).rejects.toThrow('Error fetching client enrollments: 404');
    });
  });
});