import cron from "node-cron";
import BookTransaction from "../models/bookTransaction.model.js";
import Book from "../models/book.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";
import { createNotification } from "../controllers/helpers/notification.helper.js";

const FINE_PER_DAY = 4;
const FINE_LIMIT = 10;

export const startOverdueCron = () => {
    cron.schedule("* * * * *", async () => {
        console.log("Running overdue check...");

        const now = new Date();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Due today notifications
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

        // Overdue — only past days, not today
        const overdueTransactions = await BookTransaction.find({
            status: "approved",
            dueDate: { $lt: todayStart }
        }).populate("book");

        for (const txn of overdueTransactions) {
            const daysOverdue = Math.floor((now - txn.dueDate) / (1000 * 60 * 60 * 24));
            const newFine = daysOverdue * FINE_PER_DAY;
            const difference = newFine - (txn.fineAmount || 0);

            txn.status = "overdue";
            txn.fineAmount = newFine;
            await txn.save();

            await Book.findByIdAndUpdate(txn.book._id, { status: "overdue" });

            if (difference > 0) {
                const student = await Student.findByIdAndUpdate(
                    txn.student,
                    { $inc: { fines: difference } },
                    { new: true }
                );

                if (student.fines >= FINE_LIMIT && student.canBorrow) {
                    await Student.findByIdAndUpdate(txn.student, { canBorrow: false });

                    await createNotification(
                        txn.student,
                        `Your borrowing privileges have been revoked due to unpaid fines exceeding $${FINE_LIMIT}.`,
                        "fine"
                    );
                }
            }

            const alreadyNotified = await Notification.findOne({
                student: txn.student,
                type: "overdue",
                createdAt: { $gte: todayStart }
            });

            if (!alreadyNotified) {
                await createNotification(
                    txn.student,
                    `"${txn.book.title}" is overdue by ${daysOverdue} day(s). Fine: $${newFine}.`,
                    "overdue"
                );
            }
        }

        console.log(`Overdue check done. ${overdueTransactions.length} books marked overdue.`);
    });
};