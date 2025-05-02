"use client";

import {z} from "zod";
import Link from "next/link";
import Image from "next/image";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {authFormSchema} from "@/lib/validation/auth.validation";
import FormField from "@/components/forms/FormField";
import {authService} from "@/lib/services/auth.service";
import {useState} from "react";
import {useAuth} from "@/components/providers/auth-provider";

const AuthForm = ({type}: { type: FormType }) => {
    const router = useRouter()
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });
    const isSignIn = type === "sign-in";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-in") {
                const {email, password} = data;

                const response = await authService.login({email, password});
                login(response);

                toast.success("Signed in successfully.", {
                    position: "top-left",
                });
                router.push("/dashboard");
            } else {
                const {firstName, lastName, email, password} = data;
                const response = await authService.register({
                    firstName: firstName as string,
                    lastName: lastName as string,
                    email,
                    password
                });
                login(response);

                toast.success("Account created successfully.");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.warning("Authentication failed", {
                description: error instanceof Error ? error.message : "Server error occurred",
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="card-border lg:min-w-[566px] my-4">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center items-center">
                    <Image src="/vercel.svg" alt="logo" height={32} width={38}/>
                    <h2 className="">CEMA HIS</h2>
                </div>

                <h1 className="text-3xl font-bold text-center">
                    {isSignIn ? "Welcome back!" : "Create an account"}
                </h1>
                <p className="text-muted-foreground text-sm text-center">
                    {isSignIn
                        ? "Enter your credentials to access your account"
                        : "Fill in the details to create a new account"}
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    label="FirstName"
                                    placeholder="FirstName"
                                    type="text"
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    label="LastName"
                                    placeholder="LastName"
                                    type="text"
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="your@email.com"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                        />

                        <Button className="btn" type="submit" aria-disabled={isLoading || form.formState.isSubmitting}>

                            {isLoading ? "Processing..." : isSignIn ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                </Form>

                <div className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            href={isSignIn ? "/register" : "/login"}
                            className="text-primary font-medium hover:underline"
                        >
                            {isSignIn ? "Register" : "Sign In"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
        ;
};

export default AuthForm;





