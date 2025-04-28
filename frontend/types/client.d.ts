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
    query?: string;
    paginate: boolean
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

