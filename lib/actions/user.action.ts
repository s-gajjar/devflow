'use server';

import {connectToDatabase} from "../mongoose";
import User from "@/database/user.model";
import {CreateUserParams} from "@/lib/actions/shared.types";

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