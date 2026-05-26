import Student from "../models/student.model.js";
import Librarian from "../models/librarian.model.js";
import Book from "../models/book.model.js";
import BookTransaction from "../models/bookTransaction.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";

export const admin = async (req, res) => {
    const [
        totalStudents,
        totalLibrarians,
        totalBooks,
        recentStudents,
        recentLibrarians,
        mostBorrowed,
        processedReservations,
        cancelledReservations,
        recentActivity
    ] = await Promise.all([
        Student.countDocuments(),
        Librarian.countDocuments(),
        Book.countDocuments(),
        Student.find().sort({ createdAt: -1 }).limit(3),
        Librarian.find().sort({ createdAt: -1 }).limit(2),
        BookTransaction.aggregate([
            { $match: { transactionType: "borrow", status: { $in: ["approved", "returned"] } } },
            { $group: { _id: "$book", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 },
            { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
            { $unwind: "$book" }
        ]),
        RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] } }),
        RoomTransaction.countDocuments({ status: "cancelled" }),
        BookTransaction.find({ status: "pending" })
            .populate("book")
            .populate("student")
            .sort({ createdAt: -1 })
            .limit(3)
    ]);

    res.render("admin.ejs", {
        user: req.session.user,
        stats: { totalStudents, totalLibrarians, totalBooks },
        recentStudents,
        recentLibrarians,
        mostBorrowed,
        reservations: { processed: processedReservations, cancelled: cancelledReservations },
        recentActivity
    });
};