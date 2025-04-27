export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    identificationNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientFormData {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    identificationNumber?: string;
}

export interface ClientSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// client enrollments
export interface Enrollment {
    id: string;
    clientID: string;
    programID: string;
    programName: string;
    status: 'active' | 'completed' | 'withdrawn';
    enrollmentDate: string;
    exitDate?: string;
    createdAt: string;
    updatedAt: string;

    program: {
        name: string

    }
}