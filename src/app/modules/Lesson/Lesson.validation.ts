import { z } from "zod";

export const LessonSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
    }),
});
