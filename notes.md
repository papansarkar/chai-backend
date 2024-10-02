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