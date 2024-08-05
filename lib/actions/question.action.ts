'use server';

import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams, DeleteQuestionParams, EditQuestionParams,
    GetQuestion,
    GetQuestionByIdParams,
    GetQuestionsParams, QuestionVoteParams,
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import {revalidatePath} from "next/cache";
import { Types, FilterQuery } from 'mongoose';
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        await connectToDatabase();

        const {searchQuery} = params;

        const query: FilterQuery<typeof Question> = {};

        if(searchQuery) {
            query.$or = [
                {title: { $regex: new RegExp(searchQuery, "i")}},
                {explanation: { $regex: new RegExp(searchQuery, "i")}}

            ]
        }

        const questions = await Question.find(query)
            .populate({path: 'tags', model: Tag})
            .populate({path: 'author', model: User})
            .sort({createdAt: -1})
            .lean();


        return {questions};
    } catch (e) {
        console.error("Error in getQuestions:", e);
        return {questions: [], success: false};
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        const { title, explanation, tags, author, path } = params;

        let authorId;
        if (typeof author === 'string' && author.length === 24) {
            authorId = new Types.ObjectId(author);
        } else if (author instanceof Types.ObjectId) {
            authorId = author;
        } else {
            throw new Error('Invalid author ID format');
        }

        const question = await Question.create({
            title,
            explanation,
            author: authorId,
        });
        console.log('Question created:', question._id);


        const tagDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                {name: {$regex: new RegExp(`^${tag}$`, "i")}},
                {$setOnInsert: {name: tag}, $push: {questions: question._id}},
                {upsert: true, new: true},
            );
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: {tags: {$each: tagDocuments}}
        })

        revalidatePath(path);
        return { success: true, questionId: question._id };
    } catch (error) {
        console.error('Error creating question:', error);
        return { success: false, error };
    }
}

export async function getQuestionById(params: GetQuestionByIdParams): Promise<GetQuestion | null> {
    try {
        await connectToDatabase();

        const {questionId} = params;

        const question = await Question.findById(questionId)
            .populate({path: 'tags', model: Tag, select: "_id name"})
            .populate({path: 'author', model: User, select: "_id clerkId name picture"})
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
        const {questionId, userId, path, hasupVoted} = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = {$pull: {upvotes: userId}};
        } else {
            updateQuery = {
                $pull: {downvotes: userId},
                $addToSet: {upvotes: userId}
            };
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new: true});

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
        const {questionId, userId, path, hasdownVoted} = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = {$pull: {downvotes: userId}};
        } else {
            updateQuery = {
                $pull: {upvotes: userId},
                $addToSet: {downvotes: userId}
            };
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new: true});

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

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();
        const {questionId, path} = params;

        await Question.deleteOne({_id: questionId});
        await Answer.deleteMany({question: questionId});
        await Interaction.deleteMany({question: questionId});
        await Tag.updateMany({questions: questionId}, {$pull: {questions: questionId}});


        revalidatePath(path);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {

        const {questionId, title, explanation, path} = params;

        const question = await Question.findById(questionId).populate('tags');
        if (!question) {
            throw new Error('Question not found');
        }

        question.title = title;
        question.explanation = explanation;

        await question.save();

        revalidatePath(path);
        return {success: true, questionId: questionId};
    } catch (error) {
        console.error('Error editing question:', error);
        return {success: false, error};
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({path: 'tags', model: Tag})
            .populate({path: 'author', model: User})
            .sort({upvotes: -1})
            .limit(5)
            .lean();

        return questions;
    } catch (e) {
        console.error("Error in getHotQuestions:", e);
        return [];
    }
}