import { Repository, ILike } from "typeorm";
import { Client } from "../../../domain/entities/Client";
import { IClientRepository } from "../../../domain/repositories/IClientRepository";
import { DB } from "../data-source";

export class ClientRepositoryImpl implements IClientRepository {
    private repo: Repository<Client>

    constructor() {
        this.repo = DB.getRepository(Client)
    }

    async findAll(query?: any): Promise<Client[]> {
        return this.repo.find({
            relations: ['enrollments', 'enrollments.program'],
            ...query
        });
    }

    async findById(id: string): Promise<Client | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['enrollments', 'enrollments.program']
        });
    }

    async findByIdentificationNumber(idNumber: string): Promise<Client | null> {
        return this.repo.findOne({
            where: { identificationNumber: idNumber },
            relations: ['enrollments', 'enrollments.program']
        });
    }

    async create(clientData: Partial<Client>): Promise<Client> {
        const client = this.repo.create(clientData);
        return this.repo.save(client);
    }

    async update(id: string, clientData: Partial<Client>): Promise<Client> {
        await this.repo.update(id, clientData);
        return this.repo.findOneByOrFail({ id });
    }

    async delete(id: string): Promise<boolean> {
        const deleteResult = await this.repo.delete(id);
        return !!deleteResult.affected;
    }

    async search(query: string): Promise<Client[]> {
        return this.repo.find({
            where: [
                { firstName: ILike(`%${query}%`) },
                { lastName: ILike(`%${query}%`) },
                { identificationNumber: ILike(`%${query}%`) },
                { email: ILike(`%${query}%`) },
                { phone: ILike(`%${query}%`) }
            ],
            relations: ['enrollments', 'enrollments.program']
        });
    }
}