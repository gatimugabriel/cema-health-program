"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {redirect, usePathname} from "next/navigation";
import {toast} from "sonner";
import {authService} from "@/lib/services/auth.service";

interface AuthContextType {
    user: UserWithTokens | null;
    isLoading: boolean;
    login: (userData: UserWithTokens) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserWithTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser) as UserWithTokens;

                    // Check if token is expired
                    const tokenData = JSON.parse(atob(userData.tokens.accessToken.split('.')[1]));
                    const expirationTime = tokenData.exp * 1000;

                    if (Date.now() >= expirationTime) {
                        // refresh
                        try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                            });

                            if (response.ok) {
                                const refreshedData = await response.json();
                                localStorage.setItem("user", JSON.stringify(refreshedData));
                                setUser(refreshedData);
                            } else {
                                // Refresh failed, clear auth
                                await handleLogout();
                            }
                        } catch (error) {
                            console.log("logout error", error)
                            await handleLogout();
                        }
                    } else {
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error("Auth restore error:", error);
                await handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = (userData: UserWithTokens) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = async () => {
        await authService.logout();

        // Redirect to login page if on a protected route
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
            toast.info("You've been logged out");
            redirect('/login');
        }
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: handleLogin,
                logout: handleLogout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};