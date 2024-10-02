import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1) // study this in node js docs + ai
    }
}

export default connectDB

// TODO

// how and why is it useful to have a reference as connectionInstance to the connection of DB? ai
// use console.log on connectionInstance, see what happens.