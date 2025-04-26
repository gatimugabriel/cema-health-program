import { Client } from "../entities/Client";

export interface IClientRepository {
    create(clientData: Partial<Client>): Promise<Client>;
    findAll(query?: any): Promise<Client[]>;
    findById(id: string): Promise<Client | null>;
    findByIdentificationNumber(idNumber: string): Promise<Client | null>;
    search(query: string): Promise<Client[]>;
    update(id: string, clientData: Partial<Client>): Promise<Client>;
    delete(id: string): Promise<boolean>;
  }