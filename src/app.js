// app connection happens through express
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//cors config
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

//json body-parser
app.use(express.json({limit: "16kb"}))

// url encoder config
app.use(express.urlencoded({extended: true}))

// public resources
app.use(express.static("public"))

//cookie config
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)
// http://localhost:8000/api/v1/users/register

export default app