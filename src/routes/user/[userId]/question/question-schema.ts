import { z } from "zod";
import { zfd } from "zod-form-data";

export const questionSchema = z.object({
    parentSectionId: z.string(),
	title: z.string().min(8).max(256),
	description: z.string().optional(),
	responseType: z.string(),
	score: zfd.numeric(z.number().default(0)).optional(),
	correctAnswer: z.string().optional(),
	hint: z.string().optional(),
	questionImageUrl: z.string().optional(),
	rangeMin: zfd.numeric(z.number().default(1)).optional(),
	rangeMax: zfd.numeric(z.number().default(2)).optional(),
	options: z.array(z.string()).optional()
});

export type QuestionSchema = typeof questionSchema;