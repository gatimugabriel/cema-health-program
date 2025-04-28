import {API_ENDPOINTS} from "@/lib/constants/api";
import {PaginatedResponse} from "@/types/common";

type searchParams  = {
    query?: string;
    page?: number;
    pageSize?: number;
    paginate?: boolean;
    sortBy?: string
    sortOrder?:string

};

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
            // if (!response.ok) {
            //     throw new Error(`Error fetching programs: ${response.status}`);
            // }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch programs:", error);
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

    searchPrograms: async (params: {
        query?: string;
        page?: number;
        pageSize?: number;
        paginate?: boolean;
    }): Promise<PaginatedResponse<Program>> => {
        const url = new URL(`${API_ENDPOINTS.PROGRAMS}/search`);

        if (params.query) url.searchParams.append("q", params.query);
        if (params.paginate !== undefined) url.searchParams.append("paginate", params.paginate.toString());
        if (params.page) url.searchParams.append("page", params.page.toString());
        if (params.pageSize) url.searchParams.append("pageSize", params.pageSize.toString());

        const response = await fetch(url.toString(), {
            credentials: "include",
        });

        if (!response.ok) throw new Error(`Error searching programs: ${response.status}`);
        return await response.json();
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

    searchProgram: async (params: searchParams = {}): Promise<PaginatedResponse<Program>> => {
        const {page = 1, pageSize = 10, query = '', sortBy, sortOrder} = params;

        const searchParams = new URLSearchParams();
        searchParams.append('page', page.toString());
        searchParams.append('pageSize', pageSize.toString());
        searchParams.append('query', query);

        if (sortBy) searchParams.append('sortBy', sortBy);
        if (sortOrder) searchParams.append('sortOrder', sortOrder);

        try {
            const response = await fetch(`${API_ENDPOINTS.PROGRAMS_SEARCH}?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Error searching programs: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to search programs:", error);
            throw error;
        }
    },
};

export default programService;
