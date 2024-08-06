"use server";

import {connectToDatabase} from "@/lib/mongoose";
import Answer from "@/database/answer.model";
import {
    AnswerVoteParams,
    CreateAnswerParams,
    DeleteAnswerParams,
    GetAnswersParams
} from "@/lib/actions/shared.types";
import Question from "@/database/question.model";
import {revalidatePath} from "next/cache";

import { startSession } from 'mongoose';
import Interaction from "@/database/interaction.model";

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

        const {questionId, sortBy, page = 1, pageSize = 10} = params;

        let sortOptions: any = {};

        if (sortBy) {
            switch (sortBy) {
                case "highestUpvotes":
                    sortOptions = {upvotes: -1};
                    break;
                case "lowestUpvotes":
                    sortOptions = {upvotes: 1};
                    break;
                case "recent":
                    sortOptions = {createdAt: -1};
                    break;
                case "old":
                    sortOptions = {createdAt: 1};
                    break;
                default:
                    break;
            }
        }

        const answers = await Answer.find({question: questionId})
            .populate("author", "_id clerkId name picture")
            .sort(sortOptions)

        return {answers}
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, path, hasupVoted } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } };
        } else {
            updateQuery = {
                $pull: { downvotes: userId },
                $addToSet: { upvotes: userId }
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if (!answer) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainAnswer = answer.toObject();

        return plainAnswer;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, path, hasdownVoted } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } };
        } else {
            updateQuery = {
                $pull: { upvotes: userId },
                $addToSet: { downvotes:userId }
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if (!answer) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainAnswer = answer.toObject();

        return plainAnswer;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        connectToDatabase();

        const { answerId } = params;

        const answer = await Answer.findById(answerId);

        if(!answer) {
            throw new Error("Answer not found");
        }

        await answer.deleteOne({ _id: answerId });
        await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId }});
        await Interaction.deleteMany({ answer: answerId });

    } catch (error) {
        console.log(error);
    }
}