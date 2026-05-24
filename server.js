import dotenv from "dotenv";
import app from "./index.js";
import connectDB from "./database.js";

dotenv.config();


const startServer = async () => {

    await connectDB();


    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();