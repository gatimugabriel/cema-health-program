import { Repository, ILike } from "typeorm";
import { Client } from "../../../domain/entities/Client";
import { IClientRepository } from "../../../domain/repositories/IClientRepository";
import { DB } from "../data-source";

export class ClientRepositoryImpl implements IClientRepository {
    private repo: Repository<Client>

    constructor() {
        this.repo = DB.getRepository(Client)
    }

    async findAll(page: number = 1, pageSize: number = 15): Promise<{ clients: Client[]; totalCount: number }> {
        const skip = (page - 1) * pageSize
        const [clients, totalCount] = await this.repo.findAndCount({
            relations: ['enrollments', 'enrollments.program'],
            skip,
            take: pageSize
        });
        return { clients, totalCount };
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

    /**
     * Searches for clients based on a query string.
     * this method is also paginated
     * */
    async search(query: string, page: number = 1, pageSize: number = 10): Promise<{ clients: Client[]; totalCount: number }> {
        const skip = (page - 1) * pageSize;

        const [clients, totalCount] = await this.repo.findAndCount({
            where: [
                { firstName: ILike(`%${query}%`) },
                { lastName: ILike(`%${query}%`) },
                { identificationNumber: ILike(`%${query}%`) },
                { email: ILike(`%${query}%`) },
                { phone: ILike(`%${query}%`) }
            ],
            relations: ['enrollments', 'enrollments.program'],
            skip,
            take: pageSize
        });

        return { clients, totalCount };
    }
}