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

    client: {
        firstName: string
        lastName: string
    }
}