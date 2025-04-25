import { Program } from "../entities/Program";

export interface IProgramRepository {
    findAll(): Promise<Program[]>
    findById(id: string): Promise<Program | null>
    findByName(name: string): Promise<Program | null>
    create(programData: Partial<Program>): Promise<Program>
    update(id: string, programData: Partial<Program>): Promise<Program>
    delete(id: string): Promise<boolean>
}