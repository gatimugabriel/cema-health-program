import {z} from "zod";

export const enrollmentFormSchema = z.object({
    clientID: z.string().min(20, "Client is required"),
    programID: z.string().min(20, "Program is required"),
    enrollmentDate: z.date().optional(),
    exitDate: z.date().nullable().optional(),
    status: z.enum(["active", "completed", "withdrawn"]).default("active"),
    notes: z.string().optional(),
});
