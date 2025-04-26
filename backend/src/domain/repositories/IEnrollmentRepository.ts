import { Enrollment } from "../entities/Enrollment";

export interface IEnrollmentRepository {
    findById(id: string): Promise<Enrollment | null>;
    findByClientId(clientId: string): Promise<Enrollment[]>;
    findByProgramId(programId: string): Promise<Enrollment[]>;
    findByClientAndProgram(clientId: string, programId: string): Promise<Enrollment | null>;
    create(enrollmentData: Partial<Enrollment>): Promise<Enrollment>;
    update(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment>;
    delete(id: string): Promise<boolean>;
  }