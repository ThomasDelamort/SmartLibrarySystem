import dotenv from "dotenv";

import app from "./index.js";
import connectDB from "./database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });
};

startServer();