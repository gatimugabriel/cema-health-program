import { API_ENDPOINTS } from "@/lib/constants/api";

const programService = {
    getPrograms: async (): Promise<Program[]> => {
        try {
            const response = await fetch(API_ENDPOINTS.PROGRAMS, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`Error fetching programs: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch dummyPrograms:", error);
            throw error;
        }
    },

    createProgram: async (programData: CreateProgramDto): Promise<Program> => {
        try {
            const response = await fetch(API_ENDPOINTS.PROGRAMS, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(programData),
            });
            if (!response.ok) {
                throw new Error(`Error creating program: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to create program:`, error);
            throw error;
        }
    },

    deleteProgram: async (id: string): Promise<Response> => {
        try {
            const response = await fetch(API_ENDPOINTS.PROGRAM(id), {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`Error deleting program: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to delete program ${id}:`, error);
            throw error;
        }
    },

    getProgramById: async (id: string): Promise<Program> => {
        try {
            const response = await fetch(API_ENDPOINTS.PROGRAM(id), {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`Error fetching program: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch program:`, error);
            throw error;
        }
    },

    updateProgram: async (id: string, programData: UpdateProgramDto): Promise<Program> => {
        try {
            const response = await fetch(API_ENDPOINTS.PROGRAM(id), {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(programData),
            });
            if (!response.ok) {
                throw new Error(`Error updating program: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to update program:`, error);
            throw error;
        }
    },
};

export default programService;
