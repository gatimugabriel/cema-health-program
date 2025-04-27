export const API_BASE_URL = "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
    PROGRAMS: `${API_BASE_URL}/program`,
    PROGRAM: (id: string) => `${API_BASE_URL}/program/${id}`,
};