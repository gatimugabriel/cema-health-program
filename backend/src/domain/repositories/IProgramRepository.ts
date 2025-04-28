import {Program} from "../entities/Program";

export interface IProgramRepository {
    findAll(): Promise<Program[]>

    findById(id: string): Promise<Program | null>

    findByName(name: string): Promise<Program | null>

    search(query: string, page: number, pageSize: number): Promise<{ programs: Program[]; totalCount: number }>;

    searchWithoutPagination(query: string): Promise<{ programs: Program[]; totalCount: number }>;

    create(programData: Partial<Program>): Promise<Program>

    update(id: string, programData: Partial<Program>): Promise<Program | null>

    delete(id: string): Promise<boolean>
}