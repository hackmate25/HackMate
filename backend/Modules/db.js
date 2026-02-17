import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 
const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
.then(() => {
    // Database connected
}).catch((err) => {
    if (process.env.NODE_ENV !== "production") {
        console.error('MongoDB Error: ', err);
    }
    process.exit(1);
})