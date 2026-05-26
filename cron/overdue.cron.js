import cron from "node-cron";
import BookTransaction from "../models/bookTransaction.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";
import { createNotification } from "../controllers/helpers/notification.helper.js";

const FINE_PER_DAY = 10;

export const startOverdueCron = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("Running overdue check...");

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = new Date(now);
        today.setHours(0, 0, 0, 0); 59, 999);


        const dueToday = await BookTransaction.find({
            status: "approved",
            dueDate: { $gte: todayStart, $lte: todayEnd }
        }).populate("book");

        for (const txn of dueToday) {
            await createNotification(
                txn.student,
                `"${txn.book.title}" is due today. Please return it to avoid fines.`,
                "due_today"
            );
        }


        const overdueTransactions = await BookTransaction.find({
            status: "approved",
            dueDate: { $lt: now }
        }).populate("book");

        for (const txn of overdueTransactions) {
            const daysOverdue = Math.floor((now - txn.dueDate) / (1000 * 60 * 60 * 24));
            const newFine = daysOverdue * FINE_PER_DAY;
            const difference = newFine - (txn.fineAmount || 0);

            txn.status = "overdue";
            txn.fineAmount = newFine;
            await txn.save();


            if (difference > 0) {
                await Student.findByIdAndUpdate(txn.student, {
                    $inc: { fines: difference }
                });
            }


            const alreadyNotified = await Notification.findOne({
                student: txn.student,
                type: "overdue",
                createdAt: { $gte: todayStart }
            });

            if (!alreadyNotified) {
                await createNotification(
                    txn.student,
                    `"${txn.book.title}" is overdue by ${daysOverdue} day(s). Fine: ₱${newFine}.`,
                    "overdue"
                );
            }
        }

        console.log(`Overdue check done. ${overdueTransactions.length} books marked overdue.`);
    });
};