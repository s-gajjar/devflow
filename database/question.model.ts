import { model, models, Schema, Document } from "mongoose";

export interface IQuestion extends Document {
    _id: Schema.Types.ObjectId;  // Make sure this matches the data type
    title: string;
    explanation: string;
    tags: { _id: Schema.Types.ObjectId; name: string }[]; // Include all necessary fields
    author: { _id: Schema.Types.ObjectId; name: string; picture: string };
    upvotes: Schema.Types.ObjectId[]; // If upvotes are an array of IDs
    downvotes: Schema.Types.ObjectId[]; // If downvotes are an array of IDs
    views: number;
    answers: { _id: Schema.Types.ObjectId; content: string }[];
    createdAt: Date;
}


export const QuestionSchema = new Schema<IQuestion>({
    title: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
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
