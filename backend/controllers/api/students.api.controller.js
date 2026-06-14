import Student from "../../models/student.model.js";
import Book from "../../models/book.model.js";
import Bag from "../../models/bag.model.js";
import BookTransaction from "../../models/bookTransaction.model.js";
import { createLibrarianNotification } from "../helpers/librarianNotification.helper.js";

const generateReference = () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// POST /api/students/like/:bookId  -> { liked, likes }
export const toggleLike = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const { bookId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const alreadyLiked = student.likedBooks.some((id) => id.toString() === bookId);

        if (alreadyLiked) {
            await Student.findByIdAndUpdate(studentId, { $pull: { likedBooks: bookId } });
            await Book.findByIdAndUpdate(bookId, { $inc: { likes: -1 } });
        } else {
            await Student.findByIdAndUpdate(studentId, { $push: { likedBooks: bookId } });
            await Book.findByIdAndUpdate(bookId, { $inc: { likes: 1 } });
        }

        const book = await Book.findById(bookId).select("likes");
        return res.json({ liked: !alreadyLiked, likes: book?.likes ?? 0 });
    } catch (err) {
        console.error("toggleLike error:", err);
        return res.status(500).json({ error: "Failed to update like" });
    }
};

// POST /api/students/borrow  body: { bookId, dueDate }  -> { success, referenceNumber, book, dueDate }
export const borrowBook = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const { bookId, dueDate } = req.body || {};

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: "Book not found" });

        const student = await Student.findById(studentId);
        if (!student.canBorrow)
            return res.status(403).json({
                error: "Your borrowing privileges have been revoked due to unpaid fines. Please contact an admin.",
            });

        if (book.status === "borrowed")
            return res.status(409).json({ error: "This book is already borrowed." });

        if (!dueDate || new Date(dueDate).getTime() <= Date.now())
            return res.status(400).json({ error: "Invalid due date. Please select a future date." });

        const existing = await BookTransaction.findOne({ book: bookId, student: studentId, status: "pending" });
        if (existing)
            return res.status(409).json({ error: "You already have a pending borrow request for this book." });

        const referenceNumber = generateReference();
        await BookTransaction.create({
            referenceNumber,
            book: bookId,
            student: studentId,
            librarian: null,
            transactionType: "borrow",
            status: "pending",
            dueDate: new Date(dueDate),
        });

        await createLibrarianNotification(
            `New borrow request for a book from ${req.session.user.name} ${req.session.user.lastName}.`,
            "return_request"
        );

        return res.json({ success: true, referenceNumber, book: book.title, dueDate });
    } catch (err) {
        console.error("borrowBook error:", err);
        return res.status(500).json({ error: "Failed to submit borrow request" });
    }
};

// POST /api/students/bag  body: { bookId, dueDate }  -> { success }
export const addToBag = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const { bookId, dueDate } = req.body || {};

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: "Book not found" });

        if (book.status === "borrowed")
            return res.status(409).json({ error: "This book is already borrowed." });

        if (!dueDate || new Date(dueDate).getTime() <= Date.now())
            return res.status(400).json({ error: "Invalid due date. Please select a future date." });

        const existingTransaction = await BookTransaction.findOne({
            book: bookId,
            student: studentId,
            status: "pending",
            transactionType: "borrow",
        });
        if (existingTransaction)
            return res.status(409).json({ error: "You already have a pending borrow request for this book." });

        let bag = await Bag.findOne({ student: studentId });
        if (!bag) bag = await Bag.create({ student: studentId, items: [] });

        const alreadyInBag = bag.items.some((item) => item.book.toString() === bookId);
        if (alreadyInBag)
            return res.status(409).json({ error: "This book is already in your bag." });

        bag.items.push({ book: bookId, dueDate: new Date(dueDate) });
        await bag.save();

        return res.json({ success: true });
    } catch (err) {
        console.error("addToBag error:", err);
        return res.status(500).json({ error: "Failed to add to bag" });
    }
};