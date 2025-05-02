import {z} from "zod";

export const authFormSchema = (type: FormType) => {
    return z.object({
        firstName: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        lastName: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};
