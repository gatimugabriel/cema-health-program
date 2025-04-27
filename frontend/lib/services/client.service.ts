import {API_ENDPOINTS} from "../constants/api";
import {Client, ClientFormData, ClientSearchParams, Enrollment} from "@/types/client";
import {PaginatedResponse} from "@/types/common";

const clientService = {
    /**
     * Get clients with pagination
     */
    getClients: async (params: ClientSearchParams = {}): Promise<PaginatedResponse<Client>> => {
        const {page = 1, pageSize = 10, sortBy, sortOrder} = params;

        const searchParams = new URLSearchParams();
        searchParams.append('page', page.toString());
        searchParams.append('pageSize', pageSize.toString());

        if (sortBy) searchParams.append('sortBy', sortBy);
        if (sortOrder) searchParams.append('sortOrder', sortOrder);

        try {
            const response = await fetch(`${API_ENDPOINTS.CLIENTS}?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Error fetching clients: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to fetch clients:", error);
            throw error;
        }
    },

    /**
     * Search clients
     */
    searchClients: async (params: ClientSearchParams = {}): Promise<PaginatedResponse<Client>> => {
        const {page = 1, pageSize = 10, query = '', sortBy, sortOrder} = params;

        const searchParams = new URLSearchParams();
        searchParams.append('page', page.toString());
        searchParams.append('pageSize', pageSize.toString());
        searchParams.append('query', query);

        if (sortBy) searchParams.append('sortBy', sortBy);
        if (sortOrder) searchParams.append('sortOrder', sortOrder);

        try {
            const response = await fetch(`${API_ENDPOINTS.CLIENTS_SEARCH}?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Error searching clients: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to search clients:", error);
            throw error;
        }
    },

    /**
     * Get client by ID
     */
    getClientById: async (id: string): Promise<Client> => {
        try {
            const response = await fetch(API_ENDPOINTS.CLIENT(id));

            if (!response.ok) {
                throw new Error(`Error fetching client: ${response.status}`);
            }

            const result = await response.json();
            return result.data
        } catch (error) {
            console.error(`Failed to fetch client ${id}:`, error);
            throw error;
        }
    },


    /**
     * Create a new client
     */
    createClient: async (clientData: ClientFormData): Promise<Client> => {
        try {
            const response = await fetch(API_ENDPOINTS.CLIENTS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clientData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.log(errorData,"errorData")
                throw new Error(
                    errorData?.message || `Error creating client: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to create client:", error);
            throw error;
        }
    },


    /**
     * Get client by identification number
     */
    getClientByIdentificationNumber: async (idNumber: string): Promise<Client> => {
        try {
            const response = await fetch(API_ENDPOINTS.CLIENT_BY_ID_NUMBER(idNumber));

            if (!response.ok) {
                throw new Error(`Error fetching client: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch client with ID number ${idNumber}:`, error);
            throw error;
        }
    },

    /**
     * Update an existing client
     */
    updateClient: async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
        try {
            const response = await fetch(API_ENDPOINTS.CLIENT(id), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clientData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || `Error updating client: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error(`Failed to update client ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete client
     */
    deleteClient: async (id: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.CLIENT(id), {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error deleting client: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to delete client ${id}:`, error);
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
            console.log("enrollments data", data)
            return data.data
        } catch (error) {
            console.error(`Failed to fetch enrollments for client ${clientId}:`, error);
            throw error;
        }
    }
}

export default clientService;
