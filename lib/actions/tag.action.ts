"use server";

import Tag from "@/database/tag.model";
import {connectToDatabase} from "@/lib/mongoose";
import {
    GetAllTagsParams,
    GetQuestionsByTagIdParams,
    GetTopInteractedTagsParams
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import {FilterQuery} from "mongoose";
import Question from "@/database/question.model";

interface PopulatedTag extends Document {
    name: string;
    questions: Array<{
        _id: string;
        title: string;
        tags: Array<{ _id: string; name: string }>;
        author: { _id: string; name: string; picture: string };
        upvotes: Array<{ _id: string }>;
        answers: Array<{ _id: string; content: string }>;
        views: number;
        createdAt: Date;
    }>;
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase();

        const {userId, limit = 3} = params;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const tags = await Tag.find({_id: {$in: user.saved}})
            .sort({upvotes: -1})
            .limit(limit)
            .lean();

        console.log("Tags fetched:", JSON.stringify(tags, null, 2));

        return {tags};

    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        await connectToDatabase();
        const {searchQuery, filter, pageSize = 12, page = 1} = params;

        let sortOptions: any = {};

        if (filter) {
            switch (filter) {
                case "popular":
                    sortOptions = {questions: -1};
                    break;
                case "recent":
                    sortOptions = {createdAt: -1};
                    break;
                case "old":
                    sortOptions = {createdAt: 1};
                    break;
                case "name":
                    sortOptions = {name: -1};
                    break;
                default:
                    break;
            }
        }

        const query: FilterQuery<typeof Tag> = {};
        const skipAmount = (page - 1) * pageSize;

        if (searchQuery) {
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, "i")}},
            ]
        }
        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalTags = await Tag.countDocuments(query);
        const isNext = totalTags > skipAmount + tags.length;
        return {tags, isNext};
    } catch (e) {
        console.error("Error in getAllTags:", e);
        return {tags: [], success: false};
    }
}

export async function GetQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        await connectToDatabase();

        const {tagId, page = 1, pageSize = 5, searchQuery} = params;

        const query: FilterQuery<typeof Question> = {};
        const skipAmount = (page - 1) * pageSize;

        if (searchQuery) {
            query.$or = [
                {title: {$regex: new RegExp(searchQuery, "i")}},
                {explanation: {$regex: new RegExp(searchQuery, "i")}}

            ]
        }
        const tag = await Tag.findOne({_id: tagId}).populate({
            path: 'questions',
            match: searchQuery ? {title: {$regex: searchQuery, $options: 'i'}} : {},
            options: {sort: {createdAt: -1}, skip: skipAmount, limit: pageSize + 1}, // Fetch one extra question
            populate: [
                {path: 'tags', model: 'Tag', select: '_id name'},
                {path: 'author', model: 'User', select: '_id name picture'},
                {path: 'upvotes', model: 'User', select: '_id'},
                {path: 'answers', model: 'Answer', select: '_id content'},
            ]
        }).lean() as PopulatedTag | null;

        if (!tag) {
            throw new Error("Tag not found");
        }

        const isNext = tag.questions.length > pageSize;

        if (isNext) {
            tag.questions.pop();
        }

        return {
            tagTitle: tag.name,
            isNext,
            questions: tag.questions.map((q: any) => ({
                _id: q._id.toString(),
                title: q.title,
                tags: q.tags.map((tag: any) => ({_id: tag._id.toString(), name: tag.name})),
                author: {
                    _id: q.author._id.toString(),
                    name: q.author.name,
                    picture: q.author.picture,
                },
                upvotes: q.upvotes.length,
                views: q.views,
                answers: q.answers.map((answer: any) => ({_id: answer._id.toString(), content: answer.content})),
                createdAt: new Date(q.createdAt),
            })),
            success: true
        };

    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function getPopularTags() {
    try {
        connectToDatabase();
        const tags = await Tag.aggregate([
            {$project: {name: 1, numberOfQuestions: {$size: "$questions"}}},
            {$sort: {numberOfQuestions: -1}},
            {$limit: 5},
        ])
        return tags;
    } catch (e) {
        console.error("Error in getHotQuestions:", e);
        return [];
    }
}