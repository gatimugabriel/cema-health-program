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

