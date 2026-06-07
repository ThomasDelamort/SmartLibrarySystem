import cron from "node-cron";
import Room from "../models/room.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";

export const startRoomCron = () => {
    // Runs every minute
    cron.schedule("* * * * *", async () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = new Date(now.setHours(0, 0, 0, 0));

        // Flip to occupied when reservation starts
        const starting = await RoomTransaction.find({
            status: "approved",
            reservationDate: today,
            startTime: { $lte: currentTime },
            endTime: { $gt: currentTime }
        });

        for (const txn of starting) {
            await Room.findByIdAndUpdate(txn.room, { status: "occupied" });
        }

        // Flip back to available when reservation ends
        const ending = await RoomTransaction.find({
            status: "approved",
            reservationDate: today,
            endTime: { $lte: currentTime }
        });

        for (const txn of ending) {
            txn.status = "completed";
            await txn.save();

            await Room.findByIdAndUpdate(txn.room, {
                status: "available",
                reservee: null,
                reserveDate: null,
                reserveTimeStart: null,
                reserveTimeEnd: null
            });
        }
    });
};