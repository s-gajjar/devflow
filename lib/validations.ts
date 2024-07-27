import {z} from "zod";

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters.").max(130),
    explanation: z.string().min(100, "Explanation must be at least 5 characters."),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3)




})

export default formSchema;