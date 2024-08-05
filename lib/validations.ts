import {z} from "zod";

export const QuestionSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(20),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3)
})

export const AnswerSchema = z.object({
    answer: z.string().min(10).max(1000),
})

export const ProfileSchema = z.object({
    name: z.string().min(5).max(50),
    username: z.string().min(2).max(50),
    bio: z.union([z.literal(""), z.string().min(2).max(500)]),
    portfolioWebsite: z.union([z.literal(""), z.string().trim().url()]),
    location: z.union([z.literal(""), z.string().min(2).max(50)]),
})