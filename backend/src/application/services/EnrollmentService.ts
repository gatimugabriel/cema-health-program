import { Enrollment } from "../../domain/entities/Enrollment";
import { IEnrollmentRepository } from "../../domain/repositories/IEnrollmentRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IProgramRepository } from "../../domain/repositories/IProgramRepository";
import { CreateEnrollmentDto, UpdateEnrollmentDto } from "../dtos/EnrollmentDto";

/**
 * Interacts with the repositories to perform CRUD operations on enrollment entities
 * */
export class EnrollmentService {
    constructor(
        private enrollmentRepository: IEnrollmentRepository,
        private clientRepository: IClientRepository,
        private programRepository: IProgramRepository
    ) {}

    async createEnrollment(enrollmentData: CreateEnrollmentDto): Promise<Enrollment> {
        //---check client
        const client = await this.clientRepository.findById(enrollmentData.clientID);
        if (!client) {
            throw new Error('Client with this ID not found!');
        }

        const program = await this.programRepository.findById(enrollmentData.programID);
        if (!program) {
            throw new Error('Program not found!');
        }

        //--- Check  client  enrollment in the program
        const existingEnrollment = await this.enrollmentRepository.findByClientAndProgram(
            enrollmentData.clientID,
            enrollmentData.programID
        );
        if (existingEnrollment) {
            throw new Error('Client is already enrolled in this program!');
        }

        //---default values
        if (!enrollmentData.enrollmentDate) {
            enrollmentData.enrollmentDate = new Date();
        }
        
        if (!enrollmentData.status) {
            enrollmentData.status = 'active';
        }

        return this.enrollmentRepository.create(enrollmentData);
    }

    async getEnrollmentById(id: string): Promise<Enrollment> {
        const enrollment = await this.enrollmentRepository.findById(id);
        if (!enrollment) {
            throw new Error('Enrollment not found!');
        }
        return enrollment;
    }

    async getEnrollmentsByClientId(clientId: string): Promise<Enrollment[]> {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new Error('Client not found!');
        }

        return this.enrollmentRepository.findByClientId(clientId);
    }

    async getEnrollmentsByProgramId(programId: string): Promise<Enrollment[]> {
        const program = await this.programRepository.findById(programId);
        if (!program) {
            throw new Error('Program with given ID was not found!');
        }

        return this.enrollmentRepository.findByProgramId(programId);
    }

    async updateEnrollment(id: string, enrollmentData: UpdateEnrollmentDto): Promise<Enrollment> {
        const enrollment = await this.enrollmentRepository.findById(id);
        if (!enrollment) {
            throw new Error('Enrollment not found / may have been deleted');
        }

        //-- set exitDate
        if (enrollmentData.status && 
            (enrollmentData.status === 'completed' || enrollmentData.status === 'withdrawn') && 
            !enrollmentData.exitDate) {
            enrollmentData.exitDate = new Date();
        }

        return this.enrollmentRepository.update(enrollment.id, enrollmentData);
    }

    async deleteEnrollment(id: string): Promise<boolean> {
        const enrollment = await this.enrollmentRepository.findById(id);
        if (!enrollment) {
            throw new Error('Enrollment not found / may already have been deleted');
        }
        return this.enrollmentRepository.delete(id);
    }
}