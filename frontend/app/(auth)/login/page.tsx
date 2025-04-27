import {LoginForm} from "@/components/auth/login-form";

export default function Page() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
            <p className={`pb-8`}> Use <span className="text-red-500">`admindemo@gmail.com`</span> as email and <span
                className="text-red-500">`DemoPass001`</span> as password to login
            </p>
            <div className="w-full max-w-sm">
                <LoginForm/>
            </div>
        </div>
    )
}
