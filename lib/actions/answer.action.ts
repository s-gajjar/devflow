"use server";

import {connectToDatabase} from "@/lib/mongoose";
import Answer from "@/database/answer.model";
import {CreateAnswerParams, GetAnswersParams} from "@/lib/actions/shared.types";
import Question from "@/database/question.model";
import {revalidatePath} from "next/cache";

import { startSession } from 'mongoose';

export async function createAnswer(params: CreateAnswerParams) {
    const session = await startSession();
    session.startTransaction();

    try {
        await connectToDatabase();

        const { answer, question, path, author } = params;

        console.log('Creating answer with params:', { answer, question, author });

        const newAnswer = await Answer.create([{
            answer,
            author,
            question
        }], { session });

        console.log('New answer created:', newAnswer[0]);

        const updatedQuestion = await Question.findByIdAndUpdate(
            question,
            { $push: { answers: newAnswer[0]._id } },
            { new: true, session }
        );

        console.log('Updated question:', updatedQuestion);

        await session.commitTransaction();
        revalidatePath(path);

        // Convert the Mongoose document to a plain JavaScript object
        const plainAnswer = newAnswer[0].toObject();

        // Return only the necessary, serializable fields
        return {
            _id: plainAnswer._id.toString(),
            answer: plainAnswer.answer,
            author: plainAnswer.author.toString(),
            question: plainAnswer.question.toString(),
            createdAt: plainAnswer.createdAt.toISOString()
        };
    } catch (e) {
        await session.abortTransaction();
        console.error("Error in createAnswer:", e);
        throw e;
    } finally {
        session.endSession();
    }
}

export async function getAllAnswer(params: GetAnswersParams) {
    try {
        await connectToDatabase();

        const {page, pageSize, sortBy, questionId} = params

        const answers = await Answer.find({question: questionId})
            .populate("author", "_id clerkId name picture")
            .sort({createdAt: -1})

        return {answers}
    } catch (e) {
        console.log(e)
        throw e;
    }
}

