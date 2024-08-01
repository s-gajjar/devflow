"use server";

import {ViewQuestionParams} from "@/lib/actions/shared.types";
import {connectToDatabase} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";


export async function viewQuestion(params: ViewQuestionParams) {
    try {
        connectToDatabase();

        const {questionId, userId} = params;

        await Question.findByIdAndUpdate(questionId, {$inc: {views: 1}});


        if (userId) {
            const existingInteraction = await Interaction.findOneAndUpdate({
                user: userId,
                questionId: "view",
                questions: questionId
            })

            if (existingInteraction) {
                console.log("Interaction already exists");
            }

            await Interaction.create({
                user: userId,
                action: "view",
                questions: questionId
            });
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
}