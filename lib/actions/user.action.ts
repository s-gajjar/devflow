'use server';

import {FilterQuery} from "mongoose";
import {connectToDatabase} from "../mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams, GetSavedQuestionsParams,
    ToggleSaveQuestionParams,
    UpdateUserParams
} from "@/lib/actions/shared.types";
import {revalidatePath} from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";

export async function getUserById(params: any) {
    try {
        connectToDatabase();

        const {userId} = params;

        const user = await User.findOne({clerkId: userId});
        return user;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser = await User.create(userData);
        return newUser;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const {clerkId, updateData, path} = params;

        await User.findOneAndUpdate({clerkId}, updateData, {new: true});

        revalidatePath(path);
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const {clerkId} = params;
        const user = await User.findOneAndDelete({clerkId});

        if (!user) {
            throw new Error("User not found");
        }

        // const userQuestionIds = await Question.find({ author: user._id }).distinct(_id);

        await Question.deleteMany({author: user._id});

        const deletedUser = await User.findByIdAndDelete(user._id);


        return deletedUser;

    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        // const {page = 1, pageSize = 20, filter, searchQuery} = params;

        const users = await User.find({})
            .sort({createdAt: -1})
            .lean();

        console.log("Users fetched:", JSON.stringify(users, null, 2));

        return {users};
    } catch (e) {
        console.error("Error in getAllUsers:", e);
        return {users: [], success: false};
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase();

        const {userId, questionId, path} = params;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const question = await Question.findById(questionId);
        if (!question) {
            throw new Error("Question not found");
        }

        const isQuestionSaved = user.saved.includes(questionId);

        if (isQuestionSaved) {
            await User.findByIdAndUpdate(userId, {
                $pull: {saved: questionId}
            }, {new: true});
        } else {
            await User.findByIdAndUpdate(userId, {
                $push: {saved: questionId}
            }, {new: true});
        }

        revalidatePath(path);
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        await connectToDatabase();
        console.log("Connected to database");

        const { clerkId, page = 1, pageSize = 20, filter, searchQuery } = params;
        console.log("Clerk ID:", clerkId);

        // Find the user first
        const user = await User.findOne({ clerkId }).select('saved');
        console.log("User found:", user);

        if (!user) {
            throw new Error("User not found");
        }

        // Construct the query
        const query: FilterQuery<typeof Question> = {
            _id: { $in: user.saved.map((id: { toString: () => any; }) => id.toString()) },
            ...(searchQuery ? { title: { $regex: new RegExp(searchQuery, 'i') } } : {})
        };
        console.log("Query:", query);

        // Fetch saved questions with limited population
        const savedQuestions = await Question.find(query)
            .populate({ path: 'tags', select: '_id name' })
            .populate({ path: 'author', select: '_id clerkId name picture' })
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .lean(); // This returns plain JavaScript objects

        // Convert ObjectId to string
        // @ts-ignore
        const formattedQuestions = savedQuestions.map(question => ({
            ...question,
            _id: question._id,
            author: {
                ...question.author,
                _id: question.author._id.toString(),
                clerkId: question.author.clerkId,
                name: question.author.name,
                picture: question.author.picture,
            },
            tags: question.tags.map((tag: { _id: { toString: () => any; }; name: any; }) => ({
                ...tag,
                _id: tag._id.toString(),
                name: tag.name,
            })),
            upvotes: question.upvotes.map((id: { toString: () => any; }) => id.toString()),
            answers: question.answers.map((id: { toString: () => any; }) => id.toString()),
        }));

        console.log("Number of saved questions:", formattedQuestions.length);

        return { questions: formattedQuestions, success: true };
    } catch (e) {
        console.error("Error in getSavedQuestions:", e);
        return { questions: [], success: false };
    }
}

