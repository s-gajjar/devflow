import {model, models, Schema, Document} from "mongoose";

export interface ITag extends Document {
    name: string;
    description: string;
    questions: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdOn: Date;
}

export const TagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

const Tag = models.Tag || model('Tag', TagSchema);

export default Tag;