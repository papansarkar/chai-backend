// database connection

// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 4000

connectDB()
// .then(()=>{
//     app.on("listening", ()=>{
//         console.log("Server is listeing for connection...");
//     })
// }) // added by me but unable test if this is functional
.then(()=>{
    app.on("error", (err)=>{
        console.log("ERR: ", err)
    });
}) // added by me but unable test if this is functional
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port : ${
            PORT
        }`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
})



/**
 * 
 * import mangoose from "mongoose";
import { DB_NAMR } from "./constants";

import express from "express"
const app = express()

    ;(async () => {
        try{
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error", (error)=>{
                console.log("ERROR: ", error)
                throw error
            })

            app.listen(process.env.PORT, ()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
            })
        }catch(error){
            console.error("ERROR: ", error)
            throw error
        }
    })()
 */