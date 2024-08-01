'use server';

import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams,
    GetQuestion,
    GetQuestionByIdParams,
    GetQuestionsParams, QuestionVoteParams,
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
        const serializedQuestion = JSON.parse(JSON.stringify(question));


        return serializedQuestion as GetQuestion;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();
        const { questionId, userId, path, hasupVoted } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } };
        } else {
            updateQuery = {
                $pull: { downvotes: userId },
                $addToSet: { upvotes: userId }
            };
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

        if (!question) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainQuestion = question.toObject();

        return plainQuestion;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();
        const { questionId, userId, path, hasdownVoted } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } };
        } else {
            updateQuery = {
                $pull: { upvotes: userId },
                $addToSet: { downvotes:userId }
            };
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

        if (!question) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainQuestion = question.toObject();

        return plainQuestion;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

