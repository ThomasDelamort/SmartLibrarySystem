import dotenv from "dotenv";
import app from "./index.js";
import connectDB from "./database.js";
import { startOverdueCron } from "./cron/overdue.cron.js"
import { startRoomCron } from "./cron/room.cron.js";

dotenv.config();


const startServer = async () => {

    await connectDB();
    startOverdueCron();
    startRoomCron();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();
