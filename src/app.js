// app connection happens through express
import express from "express"
import cors from "core"
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

export default app