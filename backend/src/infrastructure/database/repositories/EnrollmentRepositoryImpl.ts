import { Repository } from "typeorm";
import { Enrollment } from "../../../domain/entities/Enrollment";
import { IEnrollmentRepository } from "../../../domain/repositories/IEnrollmentRepository";
import { DB } from "../data-source";

/**
 * Interacts with the database to perform CRUD operations on Enrollment entities
 * */
export class EnrollmentRepositoryImpl implements IEnrollmentRepository {
    private repo: Repository<Enrollment>

    constructor() {
        this.repo = DB.getRepository(Enrollment)
    }

    async create(enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
        const enrollment = this.repo.create(enrollmentData);
        return this.repo.save(enrollment);
    }

    findById(id: string): Promise<Enrollment | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['program', 'client']
        });
    }

    async findByClientId(clientId: string): Promise<Enrollment[]> {
        return this.repo.find({
            where: { clientID: clientId },
            relations: ['program', 'client']
        });
    }

    async findByProgramId(programId: string): Promise<Enrollment[]> {
        return this.repo.find({
            where: { programID: programId },
            relations: ['program', 'client']
        });
    }

    async findByClientAndProgram(clientId: string, programId: string): Promise<Enrollment | null> {
        return this.repo.findOne({
            where: { 
                clientID: clientId,
                programID: programId
            },
            relations: ['program', 'client']
        });
    }


    async update(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
        await this.repo.update(id, enrollmentData);
        return this.repo.findOneByOrFail({ id });
    }

    async delete(id: string): Promise<boolean> {
        const deleteResult = await this.repo.delete(id);
        return !!deleteResult.affected;
    }
}