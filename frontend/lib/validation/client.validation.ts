import { z } from "zod";

export const ClientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    identificationNumber: z.string().min(1, "ID number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    dateOfBirth: z.date({
        required_error: "Date of birth is required",
        invalid_type_error: "Invalid date",
    }),
    gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is required",
    }),
    address: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either email or phone must be provided",
            path: ["email"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either email or phone must be provided",
            path: ["phone"],
        });
    }
});