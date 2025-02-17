import { z } from "zod";

export const loginSchema = z.object({
    firstname: z.string().min(8).max(256),
    lastname: z.string(),
    email: z.string(),
    phone: z.string(),
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string()
});

export type LoginSchema = typeof loginSchema;