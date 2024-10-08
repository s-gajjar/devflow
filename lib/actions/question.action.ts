'use server';

import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams, DeleteQuestionParams, EditQuestionParams,
    GetQuestion,
    GetQuestionByIdParams,
    GetQuestionsParams, QuestionVoteParams, RecommendedParams,
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import {revalidatePath} from "next/cache";
import {Types, FilterQuery} from 'mongoose';
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        await connectToDatabase();

        const {searchQuery, filter, page = 1, pageSize = 5} = params;

        const skipAmount = (page - 1) * pageSize;
        const query: FilterQuery<typeof Question> = {};

        if (searchQuery) {
            query.$or = [
                {title: {$regex: new RegExp(searchQuery, "i")}},
                {explanation: {$regex: new RegExp(searchQuery, "i")}}

            ]
        }

        let sortOptions: any = {};

        if (filter) {
            switch (filter) {
                case "newest":
                    sortOptions = {createdAt: -1};
                    break;
                case "frequent":
                    sortOptions = {views: -1};
                    break;
                case "unanswered":
                    query.answers = {$size: 0};
                    sortOptions = {createdAt: -1};
                    break;
                default:
                    break;
            }
        }

        const questions = await Question.find(query)
            .populate({path: 'tags', model: Tag})
            .populate({path: 'author', model: User})
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)


        const totalQuestions = await Question.countDocuments(query);
        const isNext = totalQuestions > skipAmount + questions.length;

        return {questions, isNext};
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        const {title, explanation, tags, author, path} = params;

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

        await Interaction.create({
            user: authorId,
            question: question._id,
            action: "ask_question",
            tags: tagDocuments
        })

        await User.findByIdAndUpdate(authorId, {$inc: {reputation: 5}});

        revalidatePath(path);
        return {success: true, questionId: question._id};
    } catch (error) {
        console.error('Error creating question:', error);
        return {success: false, error};
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

        await User.findByIdAndUpdate(userId, {
            $inc : { reputation: hasupVoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(question.author, {
            $inc : { reputation: hasupVoted ? -10 : 10 }
        })

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

        await User.findByIdAndUpdate(userId, {
            $inc : { reputation: hasdownVoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(question.author, {
            $inc : { reputation: hasdownVoted ? -10 : 10 }
        })

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

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        await connectToDatabase();

        const { userId, page = 1, pageSize = 5, searchQuery } = params;

        // find user
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("user not found");
        }

        const skipAmount = (page - 1) * pageSize;

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags);
            }
            return tags;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            // @ts-ignore
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
                { author: { $ne: user._id } }, // Exclude user's own questions
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error;
    }
}