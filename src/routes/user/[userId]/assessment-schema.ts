import { z } from "zod";
import { zfd } from "zod-form-data";

export const assessmentSchema = z.object({
    title: z.string().min(8).max(256),
    description: z.string().optional(),
    type: z.string(),
    currentVersion: zfd.numeric(z.number().default(0)).optional(),
    defaultSectionNumbering: zfd.checkbox().optional(),
});

export type AssessmentSchema = typeof assessmentSchema;