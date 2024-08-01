'use server';

import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams,
    GetQuestion,
    GetQuestionByIdParams,
    GetQuestionsParams,
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import {revalidatePath} from "next/cache";



export async function getQuestions(params: GetQuestionsParams) {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Database connected, fetching questions...");

        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({ createdAt: -1 })
            .lean();

        console.log("Questions fetched:", JSON.stringify(questions, null, 2));

        return { questions };
    } catch (e) {
        console.error("Error in getQuestions:", e);
        return { questions: [], success: false };
    }
}


export async function createQuestion(params: CreateQuestionParams) {

    try {
        connectToDatabase();

        const {title, explanation, tags, author, path} = params;

        const question = await Question.create({
            title,
            explanation,
            author,
        });

        const tagDouments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                {name: {$regex: new RegExp(`^${tag}$`, "i")}},
                {$setOnInsert: {name: tag}, $push: {question: question._id}},
                {upsert: true, new: true},
            );
            tagDouments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: {tags: {$each: tagDouments}}
        })

        revalidatePath(path);
    } catch (e) {
        console.log(e)
    }
}

export async function getQuestionById(params: GetQuestionByIdParams): Promise<GetQuestion | null> {
    try {
        await connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({ path: 'tags', model: Tag, select: "_id name" })
            .populate({ path: 'author', model: User, select: "_id clerkId name picture" })
            .lean()
            .exec();

        if (!question) return null;

        return question as GetQuestion;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
