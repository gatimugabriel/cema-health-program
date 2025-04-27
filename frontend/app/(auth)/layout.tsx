import { ReactNode } from "react";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = true
    if (isUserAuthenticated) redirect("/dashboard");

    return <div className="">{children}</div>;
};

export default AuthLayout;