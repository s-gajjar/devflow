import {model, models, Schema, Document} from "mongoose";

export interface IQuestion extends Document {
    title: string;
    explanation: string;
    tags: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    views: number;
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
}

export const QuestionSchema = new Schema<IQuestion>({
    title: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true
    }],
    views: {
        type: Number,
        default: 0,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    answers: [{
        type: Schema.Types.ObjectId,
        ref: "Answer",
        required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Question = models.Question || model('Question', QuestionSchema);

export default Question;