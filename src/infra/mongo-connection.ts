import mongoose from 'mongoose';

require('dotenv').config()

export const connectToDb = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!, {});
        console.log('Connected to the database');
    } catch (error) {
        console.log(`Could not connect to the database. ${error}`);
        process.exit();
    }
};