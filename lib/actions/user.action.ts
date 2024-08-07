'use server';

import {FilterQuery} from "mongoose";
import {connectToDatabase} from "../mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams,
    ToggleSaveQuestionParams,
    UpdateUserParams
} from "@/lib/actions/shared.types";
import {revalidatePath} from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import {BadgeCriteriaType} from "@/types";
import {assignBadges} from "@/lib/utils";

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

        const {searchQuery, filter, pageSize = 10, page = 1} = params;

        const query: FilterQuery<typeof User> = {};
        const skipAmount = (page - 1) * pageSize;

        if (searchQuery) {
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, "i")}},
                {username: {$regex: new RegExp(searchQuery, "i")}},
            ]
        }

        let sortOptions: any = {};

        switch (filter) {
            case "new_users":
                sortOptions = {joinedAt: -1};
                break;
            case "old_users":
                sortOptions = {joinedAt: 1};
                break;
            case "top_contributors":
                sortOptions = {reputation: -1};
                break;
            default:
                break;
        }

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .lean();

        const totalUsers = await User.countDocuments(query);
        const isNext = totalUsers > skipAmount + users.length;

        return {users, isNext};
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
        return true;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        await connectToDatabase();

        const {clerkId, page = 1, pageSize = 5, searchQuery, filter} = params;


        let sortOptions: any = {};

        switch (filter) {
            case "most_recent":
                sortOptions = {createdAt: -1};
                break;
            case "oldest":
                sortOptions = {createdAt: 1};
                break;
            case "most_viewed":
                sortOptions = {views: -1};
                break;
            case "most_answered":
                sortOptions = {answers: -1};
                break;
            case "most_voted":
                sortOptions = {upvotes: -1};
                break;
            default:
                break;
        }

        // Find the user first
        const user = await User.findOne({clerkId}).select('saved');

        if (!user) {
            throw new Error("User not found");
        }

        const query: FilterQuery<typeof Question> = {
            _id: {$in: user.saved.map((id: { toString: () => any; }) => id.toString())},
            ...(searchQuery ? {title: {$regex: new RegExp(searchQuery, 'i')}} : {})
        };
        const skipAmount = (page - 1) * pageSize;

        const savedQuestions = await Question.find(query)
            .populate({path: 'tags', select: '_id name'})
            .populate({path: 'author', select: '_id clerkId name picture'})
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .lean(); // This returns plain JavaScript objects

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


        const totalQuestions = await Question.countDocuments(query);
        const isNext = totalQuestions > skipAmount + formattedQuestions.length;

        return {questions: formattedQuestions, success: true, isNext};
    } catch (e) {
        console.error("Error in getSavedQuestions:", e);
        return {questions: [], success: false};
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase();

        const {userId} = params;

        const user = await User.findOne({clerkId: userId});
        if (!user) {
            return {userInfo: null, success: false};
        }

        const totalQuestions = await Question.countDocuments({author: user._id});
        const totalAnswers = await Answer.countDocuments({author: user._id});

        const [questionUpvotes] = await Question.aggregate([
            {$match: {author: user._id}},
            {$project: { _id: 0, upvotes: {$size: "$upvotes"}}},
            {$group: {_id: null, totalUpvotes: {$sum: "$upvotes"}}}
        ]);

        const [answerUpvotes] = await Answer.aggregate([
            {$match: {author: user._id}},
            {$project: { _id: 0, upvotes: {$size: "$upvotes"}}},
            {$group: {_id: null, totalUpvotes: {$sum: "$upvotes"}}}
        ]);

        const [questionViews] = await Answer.aggregate([
            {$match: {author: user._id}},
            {$group: {_id: null, totalViews: {$sum: "$views"}}}
        ]);

        const criteria = [
            { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
            { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
            { type: 'QUESTION_UPVOTE_COUNT' as BadgeCriteriaType, count: questionUpvotes.totalUpvotes || 0 },
            { type: 'ANSWER_UPVOTE_COUNT' as BadgeCriteriaType, count: answerUpvotes.totalUpvotes || 0 },
            { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews.totalViews || 0 },
        ]
        console.log('Criteria before assignBadges:', criteria);
        let badgeCount;
        try {
            badgeCount = assignBadges({criteria});
            console.log('Badge count:', badgeCount);
        } catch (error) {
            console.error('Error in assignBadges:', error);
            badgeCount = { GOLD: 0, SILVER: 0, BRONZE: 0 };
        }
        return {
            user,
            totalQuestions,
            totalAnswers,
            badgeCount,
        }

    } catch (e) {
        console.error("Error in getUserInfo:", e);
        return {userInfo: null, success: false};
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const {userId, page = 1, pageSize = 3} = params;

        const totalQuestions = await Question.countDocuments({author: userId});
        const skipAmount = (page - 1) * pageSize;

        const userQuestions = await Question.find({author: userId})
            .sort({createdAt: -1, views: -1, upvotes: -1})
            .populate({path: 'tags', select: '_id name'})
            .populate({path: 'author', select: '_id clerkId name picture'})
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalQuestions > skipAmount + userQuestions.length;

        return {
            totalQuestions,
            questions: userQuestions,
            isNext
        };

    } catch (e) {
        console.error('Error fetching user questions:', e);
        throw e;
    }
}

export async function getUsersAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const {userId, page = 1, pageSize = 3} = params;
        const totalAnswers = await Answer.countDocuments({author: userId});
        const skipAmount = (page - 1) * pageSize;

        const userAnswers = await Answer.find({author: userId})
            .sort({updatedAt: -1})
            .populate({path: 'question', select: '_id title'})
            .populate({path: 'author', select: '_id clerkId name picture'})
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalAnswers > skipAmount + userAnswers.length;

        return {
            totalAnswers,
            answers: userAnswers,
            isNext
        }

    } catch (e) {
        console.log(e)
        throw e;
    }
}
