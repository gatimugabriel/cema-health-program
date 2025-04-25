import { Repository } from "typeorm";
import { Program } from "../../../domain/entities/Program";
import { IProgramRepository } from "../../../domain/repositories/IProgramRepository";
import { DB } from "../data-source";

export class ProgramRepository implements IProgramRepository {
    private repo: Repository<Program>

    constructor() {
        this.repo = DB.getRepository(Program)
    }

    async findAll(): Promise<Program[]> {
        return this.repo.find()
    }
    async findById(id: string): Promise<Program | null> {
        return this.repo.findOneBy({ id })
    }
    async findByName(name: string): Promise<Program | null> {
        return this.repo.findOneBy({ name })
    }
    async create(programData: Partial<Program>): Promise<Program> {
        const program = this.repo.create(programData)
        return this.repo.save(program)
    }
    async update(id: string, programData: Partial<Program>): Promise<Program> {
        await this.repo.save({ ...programData, id })
        return this.repo.findOneByOrFail({ id })
    }
    async delete(id: string): Promise<boolean> {
        const deleteProgram = await this.repo.delete(id)
        return deleteProgram.affected ? true : false
    }
}