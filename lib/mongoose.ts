import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) {
        console.log('No MONGODB_URL found in environment variables');
    }

    if(isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL!, {
            dbName: 'devflow',
        });
        isConnected = true;
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to database:', error);
    }
}