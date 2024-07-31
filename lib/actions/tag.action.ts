"use server";

import Tag from "@/database/tag.model";
import {connectToDatabase} from "@/lib/mongoose";
import {GetTopInteractedTagsParams} from "@/lib/actions/shared.types";
import User from "@/database/user.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase();

        const { userId, limit = 3 } = params;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const tags = await Tag.find({_id: {$in: user.saved}})
            .sort({upvotes: -1})
            .limit(limit)
            .lean();

        console.log("Tags fetched:", JSON.stringify(tags, null, 2));

        return { tags };

    } catch (e) {
        console.log(e)
        throw e;
    }
}