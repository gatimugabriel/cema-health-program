export interface CreateEnrollmentDto {
    clientID: string;
    programID: string;
    enrollmentDate: Date;
    status?: 'active' | 'completed' | 'withdrawn';
    notes?: string;
}

export interface UpdateEnrollmentDto {
    enrollmentDate?: Date;
    exitDate?: Date ;
    status?: 'active' | 'completed' | 'withdrawn';

    notes?: string;
}