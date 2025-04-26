import {Request, Response} from "express";
import {EnrollmentService} from "../../application/services/EnrollmentService";
import {EnrollmentRepositoryImpl} from "../../infrastructure/database/repositories/EnrollmentRepositoryImpl";
import {ClientRepositoryImpl} from "../../infrastructure/database/repositories/ClientRepositoryImpl";
import {ProgramRepository} from "../../infrastructure/database/repositories/ProgramRepository";
import {CreateEnrollmentDto, UpdateEnrollmentDto} from "../../application/dtos/EnrollmentDto";

/**
 * @class EnrollmentController
 * @classdesc Controller for handling enrollment-related operations from HTTP requests
 *            Interacts with the enrollment service to complete actions
 */
export class EnrollmentController {
    private readonly enrollmentService: EnrollmentService;

    constructor() {
        const enrollmentRepo = new EnrollmentRepositoryImpl();
        const clientRepo = new ClientRepositoryImpl();
        const programRepo = new ProgramRepository();
        this.enrollmentService = new EnrollmentService(enrollmentRepo, clientRepo, programRepo);
    }

    async createEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const enrollmentData: CreateEnrollmentDto = req.body;
            const enrollment = await this.enrollmentService.createEnrollment(enrollmentData);
            res.status(201).json({
                success: true,
                message: "Enrollment created successfully",
                data: enrollment,
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Error creating enrollment: ${(error as Error).message}`);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const enrollment = await this.enrollmentService.getEnrollmentById(id);
            res.status(200).json({
                success: true,
                data: enrollment,
            });
        } catch (error) {
            res.status(404);
            throw new Error(`Error fetching enrollment: ${(error as Error).message}`);
        }
    }

    async getEnrollmentsByClientId(req: Request, res: Response): Promise<void> {
        try {
            const {clientId} = req.params;
            const enrollments = await this.enrollmentService.getEnrollmentsByClientId(clientId);
            res.status(200).json({
                success: true,
                data: enrollments,
            });
        } catch (error) {
            res.status(404);
            throw new Error(`Error fetching enrollments: ${(error as Error).message}`);
        }
    }

    async getEnrollmentsByProgramId(req: Request, res: Response): Promise<void> {
        try {
            const {programId} = req.params;
            const enrollments = await this.enrollmentService.getEnrollmentsByProgramId(programId);
            res.status(200).json({
                success: true,
                data: enrollments,
            });
        } catch (error) {
            res.status(404);
            throw new Error(`Error fetching enrollments: ${(error as Error).message}`);
        }
    }

    async updateEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const enrollmentData: UpdateEnrollmentDto = req.body;
            const enrollment = await this.enrollmentService.updateEnrollment(id, enrollmentData);
            res.status(200).json({
                success: true,
                message: "Enrollment updated successfully",
                data: enrollment,
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Error updating enrollment: ${(error as Error).message}`);
        }
    }

    async deleteEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            await this.enrollmentService.deleteEnrollment(id);
            res.status(200).json({
                success: true,
                message: "Enrollment deleted successfully"
            });
        } catch (error) {
            res.status(400);
            throw new Error(`Failed to delete enrollment: ${(error as Error).message}`);
        }
    }
}