# Database:

## Database connection related notes:
- database connection can throw all kinds of error 
    - so use `try/catch `
    - or `promise` (`resolve`, `reject`) with `then()`, `catch()`, `finally()`
- db connection is depends on process time
    - so use `async/wait`
- mongoose docs suggests to connect db with one-liner code **but** **this is not a good professional practice**
    - ### one approach
    ```javascript
    //sudo code
    import mangoose from "mongoose";

    function connectDB(){}

    connectDB()
    ```
    - ### better alternative using *iife*
    ```javascript
    import mangoose from "mongoose";
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

    //notice the ';' before the iife function, this is a cleaning purpose safety measure if ';' previous code doesn't end with ';'

    // the app.on() is express function which is used here to log error from express server during dab connection
    ```

    - ### another probably the best approach is to modulerizing the code, in case the index.js becomes clunky with all sorts of connections
        - this approach invloves db/database folder where we create all the connection code and export it.
        - src directory index file imports the file and executes it

        ```javascript
        //db.index.js
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
        ```

        ```javascript
        // src/index.js
        // database connection

        // require('dotenv').config({path: './env'})
        import dotenv from "dotenv"
        import connectDB from "./db/index.js";
        import app from "./app.js"

        dotenv.config({
            path: './env'
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
        ```




## Explaination of how db and server connnection works

### Does `connectDB` Return a Promise?

Yes, the `connectDB` function returns a promise. This is because it is an `async` function, and `async` functions always return a promise. When the `await` keyword is used inside an `async` function, it pauses the execution until the promise is resolved or rejected.

### Step-by-Step Explanation

Let's break down how the code works to connect the database and start the server:

1. **Environment Configuration**:
   ```javascript
   import dotenv from "dotenv";
   dotenv.config({ path: './env' });
   ```
   - The `dotenv` package is used to load environment variables from a `.env` file into `process.env`.

2. **Importing Dependencies**:
   ```javascript
   import connectDB from "./db/index.js";
   import app from "./app.js";
   ```
   - `connectDB` is imported from `./db/index.js` to handle the database connection.
   - `app` is imported from `./app.js`, which is an Express application instance.

3. **Setting the Port**:
   ```javascript
   const PORT = process.env.PORT || 4000;
   ```
   - The port is set from the environment variable `PORT`, defaulting to `4000` if not specified.

4. **Connecting to the Database**:
   ```javascript
   connectDB()
   ```
   - The `connectDB` function is called, which attempts to connect to the MongoDB database.

5. **Handling Events and Starting the Server**:
   ```javascript
   .then(() => {
       app.on("error", (err) => {
           console.log("ERR: ", err);
       });
   })
   .then(() => {
       app.listen(PORT, () => {
           console.log(`Server is running on port : ${PORT}`);
       });
   })
   .catch((err) => {
       console.log("MONGO db connection failed !!!", err);
   });
   ```
   - If the database connection is successful, the first `.then` block sets up an error event listener on the Express app.
   - The second `.then` block starts the server and listens on the specified port.
   - If the database connection fails, the `.catch` block logs the error.

### Detailed Breakdown of `connectDB`

    **javascript:src/db/index.js**

- **`mongoose.connect`**: This function attempts to connect to the MongoDB database using the URI and database name.
- **`await`**: Pauses the execution until the connection is established.
- **`connectionInstance`**: Contains details about the connection, such as the host.
- **Error Handling**: If the connection fails, the error is logged, and the process exits with a failure code.

### Express Application Setup

    **javascript:src/app.js**


- **Express Instance**: Creates an instance of an Express application, which is exported for use in other files.

### Constants
    **javascript:src/constants.js**

- **Express Instance**: Creates an instance of an Express application, which is exported for use in other files.


- **DB_NAME**: Defines the name of the database to be used.

### Summary

1. **Load Environment Variables**: Using `dotenv`.
2. **Import Dependencies**: `connectDB` for database connection and `app` for the Express application.
3. **Set Port**: From environment variables or default to `4000`.
4. **Connect to Database**: Using `connectDB`.
5. **Handle Events and Start Server**: Set up event listeners and start the server if the database connection is successful.


---
------------End of section--------------
---

# config settings: 

## app.use()

- this `use()` method mostly used when dealing with middleware and config settings
- middleware doesn't call the `app.get() `, instead it calls the `app.use()`.
- it makes sense though middleware is just a middle man performing some task before the routing methods performs db or server related task, so we use it :) 


## CORS (npm package)

```javascript
import cors from "core"
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))
```
- It's safety measure for web, which gives options to config correct origin from where the backend calls can occur using the `origin` parameter
- don't use default options mentioned in docs
- there are also dynamic origin setting for multiple origin
- it uses `app.use()`

## app.use(express.json())

```javascript
app.use(express.json({limit: "16kb"}))
```

- this `.json()` is middleware config which allows us config incoming json from user to backend
- comes with express, no need for extra package, in older express we needed body-parser package but it comes with express now, so no stress
- it has options limit the json object mainly to not crash the server
- here we used 16kb limit, it can be set according the server capacity

## url encoder config

```javascript
app.use(express.urlencoded({extended: true, limit: "16kb"}))
```

- sometimes different url encoder converts an url with different special character, like '+' instead of '?'...
- we need to explicitly mention this to express so when we need the url data for our backend business logic it obeys a specific rule, we can infer correct url format
- it is available through express directly 
- here the `extended` keyword allows to pass nested object
- `limit` sets the size

## config for static resources

```javascript
app.use(express.static("public"))
```
- it also comes with express
- we use it to store static resources in the server like fevicon, images etc
- the `public` keyword is for a folder name which will store the resources, the name can be anything but for convience we used public since it will accessible to anyone

## cookie config
```javascript
```
- the `cookie` config's job is to allow us to access user's browser `cookie`
- with that we can set or get `cookie` from the user browser similar to `CRUD` operation
- in some cases we may need to store secure cookies to the user browser on which only server can have access and perform `CRUD` related task



## Questions:
- why don't use `next()` after each config setup like middleware settings?
---
--------- end of config settings ----------
----


# utils

## asyncHander.js
- throughout the development process we will make lots of database connection calls,and as we can see 
in `db/index.js` file, the db connection always needs error handling and `async/await`, which generates 
boiler code

- the solution is wrapper function which handle the errors and asynchronous nature
- to achieve that we can use `Promise()` with catch or `try/catch`
- here we used `promise()`

```javascript
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        await Promise.resolve(requestHandler(req, res, next))
        .catch((err)=>next(err))
    }
}

export {asyncHandler}
```

## ApiError.js
- throuout the codebase we will face lots of errors, to organize those errors in structured manner is useful when dealing with them later
- so we extended the `node js` `Error` class to customize our errors for better error comprehensiveness down the road

```javascript
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}
```

## ApiRespose
- similar to the `ApiError.js` we need a organized `response` tool to better understand the responses 
- but node js doesn't provide any `Response` Handling class like `Error` class
- becasue `Response` and `Request` is part of server which is handled by `Express`
- in that case we create a class from ground up especially for managing responses
- notice the `statusCode` parameter (use chatgpt or mdm site), here **100-300** are all success codes

```javascript
class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
```

# Model

## third-party storage(cloudinary):

## password:

## refreshToken:

## aggregation pipeline:
### `mongoose-aggregate-paginate-v2`
- plugins [`videoSchema.plugin(mongooseAggregatePaginate)`]

## bcrypt:

## jwt:

### access token

### refresh token

## mongoose middleware hooks: [https://mongoosejs.com/docs/middleware.html]
### pre hook
- because pre hook needs context (`this` keyword), arrow functions doesn't have context, we need to use normal function inside the hook method
    ```javascript
        userSchema.pre("save", async function (next) {
            if(!this.isModified("password")) return next()
            
            this.password = bcrypt.hash(this.password, 10)
            next()
        })
    ```

### post hook



## Questions:
- how to enable searchable function on a database property?
- what are the functions of `index`?
- why does arrow functions not suitable inside pre hook methods?
    - because pre hook needs context (`this` keyword), arrow functions doesn't have context. 


# File Upload

## cloudinary

## multer

## node js fs
### fsPromises.unlink(path)


# Middleware
[Perplexity Explaination](https://www.perplexity.ai/search/how-does-middleware-err-req-re-KLS_FM1aSDeyVbNzgOPh.Q)



# HTTP

## URI
## URL
## URN