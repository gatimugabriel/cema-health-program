import {Client} from "@/types/client";

export interface Enrollment {
    id: string;
    clientID: string;
    programID: string;
    programName: string;
    status: 'active' | 'completed' | 'withdrawn';
    enrollmentDate: string;
    exitDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;

    program: Program
    client: Client
}

interface CreateEnrollmentDto {
    clientID: string;
    programID: string;
    enrollmentDate: Date | string | undefined;
    exitDate?: Date | string | null;
    status: 'active' | 'completed' | 'withdrawn';
    notes?: string;
}

export interface UpdateEnrollmentDto {
    status?: 'active' | 'completed' | 'withdrawn';
    exitDate?: string;
}
