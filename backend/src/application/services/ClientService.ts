import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { CreateClientDto, UpdateClientDto } from "../dtos/ClientDto";

export class ClientService {
    constructor(private clientRepository: IClientRepository) {}

    async createClient(clientData: CreateClientDto): Promise<Client> {
        // check if identification number  already exists
        const existingClient = await this.clientRepository.findByIdentificationNumber(clientData.identificationNumber);
        if (existingClient) {
            throw new Error('A client with this identification number already exists!');
        }

        return this.clientRepository.create(clientData);
    }


    /**
     * Retrieves all clients with pagination.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of clients per page.
     * @returns An object containing the clients, total count, and total pages.
     * */
    async getAllClients(page: number = 1, pageSize: number = 10): Promise<{ clients: Client[]; totalCount: number; totalPages: number }> {
        const { clients, totalCount } = await this.clientRepository.findAll(page, pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);

        return { clients, totalCount, totalPages };
    }

    async getClientById(id: string): Promise<Client | null> {
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new Error('Client not found!');
        }
        return client;
    }

    async getClientByIdentificationNumber(idNumber: string): Promise<Client | null> {
        const client = await this.clientRepository.findByIdentificationNumber(idNumber);
        if (!client) {
            throw new Error('Client with this ID not found!');
        }
        return client;
    }

    async updateClient(id: string, clientData: UpdateClientDto): Promise<Client> {
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new Error('Client not found / may have been deleted!');
        }

        // Check if ID number is being updated and if it already exists
        if (clientData.identificationNumber && clientData.identificationNumber !== client.identificationNumber) {
            const existingClient = await this.clientRepository.findByIdentificationNumber(
                clientData.identificationNumber
            );
            if (existingClient) {
                throw new Error('A client with this identification number already exists');
            }
        }

        return this.clientRepository.update(id, clientData);
    }

    async deleteClient(id: string): Promise<boolean> {
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new Error('Client not found!');
        }

        return this.clientRepository.delete(id);
    }

    /**
     * Searches for clients based on a query string.
     * this method is also paginated
     * @param query - The search query.
     * @param paginate - Whether to paginate the results.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of clients per page.
     * @returns An object containing the clients, total count, and total pages.
     * */
    async searchClients(query: string, paginate = true, page: number = 1, pageSize: number = 10): Promise<{ clients: Client[]; totalCount: number; totalPages: number }> {
        if (!query || query.trim() === '') {
            return this.getAllClients(page, pageSize);
        }
        // clean query
        query = query.replace(/^["']|["']$/g, '')

        if (!paginate) {
            const { clients } = await this.clientRepository.searchWithoutPagination(query);
            return { clients, totalCount: clients.length, totalPages: 1 };
        }

        const { clients, totalCount } = await this.clientRepository.search(query, page, pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);

        return { clients, totalCount, totalPages };
    }
}