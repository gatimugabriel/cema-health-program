"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

/**
 * Component that wraps protected routes to ensure the user is authenticated
 */
export default function AuthWrapper({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        redirect("/login");
        return null;
    }

        return <>{children}</>;
}