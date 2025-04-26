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

    async getAllClients(): Promise<Client[]> {
        return this.clientRepository.findAll();
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

    async searchClients(query: string): Promise<Client[]> {
        throw new Error("yet to implement")
    }
}