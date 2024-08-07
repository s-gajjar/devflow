"use server";

import {SearchParams} from "@/lib/actions/shared.types";
import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

const SearchableTypes = ['question', 'user', 'tag', 'answer'];

export async function globalSearch(params: SearchParams) {
    try {
        connectToDatabase();
        const {query, type} = params;

        const regexQuery = {$regex: query, $options: 'i'};

        let results = [];

        const modelsAndTypes = [
            {model: Question, type: 'question', searchFields: 'title'},
            {model: User, type: 'user', searchFields: 'name'},
            {model: Tag, type: 'tag', searchFields: 'name'},
            {model: Answer, type: 'answer', searchFields: 'answer'}
        ]

        const typeLower = type?.toLowerCase();

        if (!typeLower || !SearchableTypes.includes(typeLower)) {

            for (const {model, searchFields, type} of modelsAndTypes) {
                const queryResult = await model
                    .find({[searchFields]: regexQuery})
                    .limit(2);

                results.push(
                    ...queryResult.map((item) => ({
                        title: type === 'answer'
                            ? `Answers containing ${query}`
                            : item[searchFields],
                        type,
                        id: type === 'user'
                            ? item.clerkid
                            : type==='answer'
                                ? item.question
                                : item._id
                    }))
                )
            }

        } else {
            const modelInfo = modelsAndTypes.find((item) => item.type === type);

            if (!modelInfo) {
                throw new Error(`Invalid type: ${type}`);
            }

            const queryResult = await modelInfo.model
                .find({[modelInfo.searchFields]: regexQuery})
                .limit(8);

            results = queryResult.map((item) => ({
                title: type === 'answer' ? `Answers containing ${query}` : item[modelInfo.searchFields],
                type: type,
                id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item.id,
            }));
        }

        return JSON.stringify(results);
    } catch (e) {
        console.log(e);
        throw e;
    }
}