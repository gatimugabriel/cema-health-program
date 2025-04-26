export interface CreateClientDto {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    email: string;
    phone?: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    address?: string;
}

export interface UpdateClientDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    identificationNumber?: string
}
