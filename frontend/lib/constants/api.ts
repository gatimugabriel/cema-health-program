export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||"http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
    // Programs
    PROGRAMS: `${API_BASE_URL}/program`,
    PROGRAM: (id: string) => `${API_BASE_URL}/program/${id}`,
    PROGRAMS_SEARCH: `${API_BASE_URL}/program/search`,

    // Clients
    CLIENTS: `${API_BASE_URL}/client`,
    CLIENTS_SEARCH: `${API_BASE_URL}/client/search`,
    CLIENTS_SEARCH_WITHOUT_PAGINATION: `${API_BASE_URL}/client/searchwp`,
    CLIENT: (id: string) => `${API_BASE_URL}/client/${id}`,
    CLIENT_BY_ID_NUMBER: (idNumber: string) => `${API_BASE_URL}/client/identification/${idNumber}`,

    // Enrollments
    ENROLLMENTS: `${API_BASE_URL}/enrollment`,
    ENROLLMENT: (id: string) => `${API_BASE_URL}/enrollment/${id}`,
    CLIENT_ENROLLMENTS: (clientId: string) => `${API_BASE_URL}/enrollment/client/${clientId}`,
    PROGRAM_ENROLLMENTS: (programId: string) => `${API_BASE_URL}/enrollment/program/${programId}`,
};