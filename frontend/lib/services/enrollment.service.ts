import { API_ENDPOINTS } from "@/lib/constants/api";
import { Enrollment } from "@/types/client";

export interface CreateEnrollmentDto {
  clientId: string;
  programId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'withdrawn';
  exitDate?: string;
}

export interface UpdateEnrollmentDto {
  status?: 'active' | 'completed' | 'withdrawn';
  exitDate?: string;
}

const enrollmentService = {
  /**
   * Get all enrollments
   */
  getEnrollments: async (): Promise<Enrollment[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.ENROLLMENTS);

      if (!response.ok) {
        throw new Error(`Error fetching enrollments: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      throw error;
    }
  },

  /**
   * Get enrollment by ID
   */
  getEnrollmentById: async (id: string): Promise<Enrollment> => {
    try {
      const response = await fetch(API_ENDPOINTS.ENROLLMENT(id));

      if (!response.ok) {
        throw new Error(`Error fetching enrollment: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch enrollment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new enrollment
   */
  createEnrollment: async (enrollmentData: CreateEnrollmentDto): Promise<Enrollment> => {
    try {
      const response = await fetch(API_ENDPOINTS.ENROLLMENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error creating enrollment: ${response.status}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Failed to create enrollment:", error);
      throw error;
    }
  },

  /**
   * Update an existing enrollment
   */
  updateEnrollment: async (id: string, enrollmentData: UpdateEnrollmentDto): Promise<Enrollment> => {
    try {
      const response = await fetch(API_ENDPOINTS.ENROLLMENT(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error updating enrollment: ${response.status}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to update enrollment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete enrollment
   */
  deleteEnrollment: async (id: string): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.ENROLLMENT(id), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error deleting enrollment: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to delete enrollment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get client enrollments
   */
  getClientEnrollments: async (clientId: string): Promise<Enrollment[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.CLIENT_ENROLLMENTS(clientId));

      if (!response.ok) {
        throw new Error(`Error fetching client enrollments: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch enrollments for client ${clientId}:`, error);
      throw error;
    }
  },

  /**
   * Get program enrollments
   */
  getProgramEnrollments: async (programId: string): Promise<Enrollment[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.PROGRAM_ENROLLMENTS(programId));

      if (!response.ok) {
        throw new Error(`Error fetching program enrollments: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch enrollments for program ${programId}:`, error);
      throw error;
    }
  },
};

export default enrollmentService;