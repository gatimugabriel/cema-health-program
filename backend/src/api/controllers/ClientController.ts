import {Request, Response} from "express";
import {ClientService} from "../../application/services/ClientService";
import {ClientRepositoryImpl} from "../../infrastructure/database/repositories/ClientRepositoryImpl";
import {CreateClientDto, UpdateClientDto} from "../../application/dtos/ClientDto";

/**
 * @class ClientController
 * @classdesc handles all client-related operations from HTTP requests
 *            Interacts with the client service to complete actions
 */
export class ClientController {
    private readonly clientService: ClientService;

    constructor() {
        const clientRepo = new ClientRepositoryImpl();
        this.clientService = new ClientService(clientRepo);
    }

    async createClient(req: Request, res: Response): Promise<void> {
        try {
            const clientData: CreateClientDto = req.body;
            const client = await this.clientService.createClient(clientData);
            res.status(201).json({
                success: true,
                message: "Client created successfully",
                data: client,
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Error creating new client: ${(error as Error).message}`);
        }
    }

    async getAllClients(req: Request, res: Response): Promise<void> {
        try {
            const clients = await this.clientService.getAllClients();
            res.status(200).json({
                success: true,
                data: clients,
            });
        } catch (error) {
            res.status(500);
            throw new Error(`Error fetching clients: ${(error as Error).message}`);
        }
    }

    async getClientById(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const client = await this.clientService.getClientById(id);
            res.status(200).json({
                success: true,
                data: client,
            });
        } catch (error) {
            res.status(404);
            throw new Error(`Failed to get client: ${(error as Error).message}`);
        }
    }

    async updateClient(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const clientData: UpdateClientDto = req.body;
            const client = await this.clientService.updateClient(id, clientData);
            res.status(200).json({
                success: true,
                message: "Client updated successfully",
                data: client,
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Error updating client: ${(error as Error).message}`);
        }
    }

    async deleteClient(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            await this.clientService.deleteClient(id);
            res.status(200).json({
                success: true,
                message: "Client deleted successfully",
                data: null,
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Failed to delete client: ${(error as Error).message}`);
        }
    }

    async searchClients(req: Request, res: Response): Promise<void> {
        try {
        console.log("searching")
        } catch (error) {
            res.status(500);
            throw new Error(`Error searching clients: ${(error as Error).message}`);
        }
    }

    async getClientByIdentificationNumber(req: Request, res: Response): Promise<void> {
        try {
            const {idNumber} = req.params;
            const client = await this.clientService.getClientByIdentificationNumber(idNumber);
            res.status(200).json({
                success: true,
                data: client,
            });
        } catch (error) {
            res.status(404);
            throw new Error(`Failed to get client: ${(error as Error).message}`);
        }
    }
}