import {model, models, Schema, Document} from "mongoose";

export interface IAnswer extends Document {
    answer: string;
    author: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    createdAt: Date;
}

export const AnswerSchema = new Schema<IAnswer>({
    answer: {
        type: String,
        ref: 'Answer',
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Upvote',
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Downvote',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Answer = models.Answer || model('Answer', AnswerSchema);

export default Answer;