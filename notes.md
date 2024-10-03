# NOTES:

## Database connection related notes:
- database connection can throw all kinds of error 
    - use `try/catch `
    - or `promise` (`resolve`, `reject`) with `then()`, `catch()`, `finally()`
- db connection is depends on process time
    - use `async/wait`
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
        - index file imports the file and executesit





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

