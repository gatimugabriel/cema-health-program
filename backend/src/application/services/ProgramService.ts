import {Program} from "../../domain/entities/Program";
import {IProgramRepository} from "../../domain/repositories/IProgramRepository";
import {CreateProgramDto, UpdateProgramDto} from "../dtos/ProgramDto";

export class ProgramService {
    constructor(private programRepository: IProgramRepository) {
    }

    async createProgram(programData: CreateProgramDto): Promise<Program> {
        const existingProgram = await this.programRepository.findByName(programData.name)
        if (existingProgram) {
            throw new Error('A Program with this name already exists!')
        }

        return this.programRepository.create(programData)
    }

    async getAllPrograms(): Promise<Program[]> {
        return this.programRepository.findAll()
    }

    async getProgramById(id: string): Promise<Program | null> {
        return this.programRepository.findById(id)
    }

    /**
     * Searches for programs based on a query string.
     * this method is also paginated
     * @param query - The search query.
     * @param paginate - Whether to paginate the results.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of programs per page.
     * @returns An object containing the programs, total count, and total pages.
     * */
    async searchPrograms(query: string, paginate = true, page: number = 1, pageSize: number = 10): Promise<{
        programs: Program[];
        totalCount: number;
        totalPages: number
    }> {
        // clean query
        query = query.replace(/^["']|["']$/g, '')

        if (!paginate) {
            const {programs} = await this.programRepository.searchWithoutPagination(query);
            return {programs, totalCount: programs.length, totalPages: 1};
        }

        const {programs, totalCount} = await this.programRepository.search(query, page, pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);

        return {programs, totalCount, totalPages};
    }

    async updateProgram(id: string, programData: UpdateProgramDto): Promise<Program | null> {
        const program = await this.programRepository.findById(id)
        if (!program) {
            throw new Error('Program not found/ may have been deleted!')
        }

        //check for exsting programs with given name
        if (programData.name && programData.name.toLocaleLowerCase() !== program.name.toLocaleLowerCase()) {
            const existingProgram = await this.programRepository.findByName(programData.name)
            if (existingProgram) {
                throw new Error('A Program with this name already exists!')
            }
        }

        return this.programRepository.update(id, programData)
    }

    async deleteProgram(id: string): Promise<boolean> {
        const program = await this.programRepository.findById(id)
        if (!program) {
            throw new Error('Program not found/ may have been deleted!')
        }

        return this.programRepository.delete(id)
    }


}