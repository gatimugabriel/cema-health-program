export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string
    lastName: string
    phone: string
    role?: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UserTokenDto {
    userID: number | string;
    token: string;
    type: string;
}
