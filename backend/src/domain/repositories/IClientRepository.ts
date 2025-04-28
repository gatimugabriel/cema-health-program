import { Client } from "../entities/Client";

export interface IClientRepository {
    create(clientData: Partial<Client>): Promise<Client>;
    findAll(page: number, pageSize: number): Promise<{ clients: Client[]; totalCount: number }>;
    findById(id: string): Promise<Client | null>;
    findByIdentificationNumber(idNumber: string): Promise<Client | null>;
    search(query: string, page: number, pageSize: number): Promise<{ clients: Client[]; totalCount: number }>;
    searchWithoutPagination(query: string): Promise<{ clients: Client[]; totalCount: number }>;
    update(id: string, clientData: Partial<Client>): Promise<Client>;
    delete(id: string): Promise<boolean>;
  }