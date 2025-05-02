type FormType = "sign-in" | "sign-up";

interface Tokens {
    refreshToken: string;
    accessToken: string;
}

interface UserWithTokens {
    user: User;
    tokens: Tokens;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}