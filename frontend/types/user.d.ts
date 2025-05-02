interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    role: "doctor" | "admin"
    createdAt: string;
    updatedAt: string;
}