import {ReactNode} from "react";
import {AuthProvider} from "@/components/providers/auth-provider";

const AuthLayout = ({children}: { children: ReactNode }) => {
    return (
        <AuthProvider>
            <div className="auth-layout">{children}</div>
        </AuthProvider>
    )
};

export default AuthLayout;