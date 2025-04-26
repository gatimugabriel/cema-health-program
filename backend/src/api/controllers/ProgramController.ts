import { Request, Response } from "express"
import { ProgramService } from "../../application/services/ProgramService";
import { ProgramRepository } from "../../infrastructure/database/repositories/ProgramRepository";
import { CreateProgramDto, UpdateProgramDto } from "../../application/dtos/ProgramDto";

/**
 * @class ProgramController
 * @classdesc Controller for handling program-related operations from http requests
 *            Interacts(directs requests) with the program service to complete actions
 */
export class ProgramController {
    private readonly programService: ProgramService;

    constructor() {
        const programRepo = new ProgramRepository()
        this.programService = new ProgramService(programRepo)
    }

    async createProgram(req: Request, res: Response): Promise<void> {
        try {
            const programData: CreateProgramDto = req.body;
            const program = await this.programService.createProgram(programData);
            res.status(201).json(program);
        } catch (error) {
            throw new Error(`Error creating program: ${(error as Error).message}`)
        }
    }


    async getAllPrograms(req: Request, res: Response) {
        try {
            const programs = await this.programService.getAllPrograms();
            res.status(200).json(programs);
        } catch (error) {
            throw new Error(`Error fetching programs: ${(error as Error).message}`)
        }
    }

    async getProgramById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const program = await this.programService.getProgramById(id);
            res.status(200).json(program);
        } catch (error) {
            throw new Error(`Program not found: ${(error as Error).message}`)
        }
    }

    async updateProgram(req: Request, res: Response): Promise<void> {
        try {
          const { id } = req.params;
          const programData: UpdateProgramDto = req.body;
          const program = await this.programService.updateProgram(id, programData);
          res.status(200).json(program);
        } catch (error) {
            throw new Error(`Error updating program: ${(error as Error).message}`)
        }
      }

    async deleteProgram(req: Request, res: Response): Promise<void> {
        try {
          const { id } = req.params;
          await this.programService.deleteProgram(id);
          res.status(204).send()
        } catch (error) {
            throw new Error(`Failed to delete program: ${(error as Error).message}`)
        }
      }
}