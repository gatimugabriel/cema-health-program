import {API_BASE_URL} from "../constants/api";
// import {cookies} from "next/headers";

export const authService = {
    login: async (data: LoginRequest): Promise<UserWithTokens> => {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        return response.json();
    },

    register: async (data: RegisterRequest): Promise<UserWithTokens> => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed");
        }

        return response.json();
    },

    refreshToken: async (): Promise<UserWithTokens> => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Token refresh failed");
        }

        return response.json();
    },

    logout: async (): Promise<void> => {
        // const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        //     method: "POST",
        //     credentials: "include",
        // });
        //
        // if (!response.ok) {
        //     throw new Error("Logout failed");
        // }

        //for now, I assume server logs out well (I will add the logout endpoint)
        console.log('server logout')
        localStorage.removeItem("user");

        // clear cookies
        // const cookieStore = await cookies()
        // cookieStore.delete('accessToken')
    },
};