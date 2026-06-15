import LibrarianNotification from "../../models/librarianNotification.model.js";
import BookTransaction from "../../models/bookTransaction.model.js";
import RoomTransaction from "../../models/roomTransaction.model.js";
import Book from "../../models/book.model.js";
import Student from "../../models/student.model.js";
import Room from "../../models/room.model.js";
import { createNotification } from "../helpers/notification.helper.js";
import { createSearchFilter } from "../helpers/book.helper.js";

const FINE_PER_DAY = 4;

// GET /api/librarian/notifications  -> { notifications, unreadCount }
export const getNotifications = async (req, res) => {
    try {
        const notifications = await LibrarianNotification.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.json({
            notifications: notifications.map((n) => ({
                id: n._id,
                message: n.message,
                type: n.type,
                createdAt: n.createdAt,
            })),
            unreadCount: notifications.length,
        });
    } catch (err) {
        console.error("getNotifications error:", err);
        return res.status(500).json({ error: "Failed to load notifications" });
    }
};

// POST /api/librarian/notifications/read/:id  -> { success }
export const markNotificationRead = async (req, res) => {
    try {
        await LibrarianNotification.findByIdAndUpdate(req.params.id, { isRead: true });
        return res.json({ success: true });
    } catch (err) {
        console.error("markNotificationRead error:", err);
        return res.status(500).json({ error: "Failed to update notification" });
    }
};

// POST /api/librarian/notifications/clear  -> { success }
export const clearAllNotifications = async (req, res) => {
    try {
        await LibrarianNotification.updateMany({ isRead: false }, { isRead: true });
        return res.json({ success: true });
    } catch (err) {
        console.error("clearAllNotifications error:", err);
        return res.status(500).json({ error: "Failed to clear notifications" });
    }
};

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

// GET /api/librarian/transactions  -> { stats, bookTransactions, roomTransactions }
export const getTransactions = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date().setHours(0, 0, 0, 0);

        const [pendingBooks, pendingRooms, borrowed, overdueCount, returnedToday] = await Promise.all([
            BookTransaction.find({ status: "pending" }).populate("book").populate("student"),
            RoomTransaction.find({ status: "pending" }).populate("room").populate("reservee"),
            BookTransaction.countDocuments({ status: "approved", dueDate: { $gte: now } }),
            BookTransaction.countDocuments({ status: { $in: ["approved", "overdue"] }, dueDate: { $lt: now } }),
            BookTransaction.countDocuments({
                status: "returned",
                transactionType: "return",
                returnDate: { $gte: startOfToday },
            }),
        ]);

        return res.json({
            stats: { borrowed, overdue: overdueCount, returnedToday },
            bookTransactions: pendingBooks
                .filter((t) => t.book)
                .map((t) => ({
                    id: t._id,
                    transactionType: t.transactionType,
                    book: { title: t.book.title },
                    student: t.student
                        ? { firstName: t.student.firstName, lastName: t.student.lastName }
                        : null,
                    dueDate: t.dueDate,
                })),
            roomTransactions: pendingRooms
                .filter((t) => t.room)
                .map((t) => ({
                    id: t._id,
                    room: { number: t.room.number },
                    reservee: t.reservee
                        ? { firstName: t.reservee.firstName, lastName: t.reservee.lastName }
                        : null,
                    reservationDate: t.reservationDate,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    purpose: t.purpose || null,
                })),
        });
    } catch (err) {
        console.error("getTransactions error:", err);
        return res.status(500).json({ error: "Failed to load transactions" });
    }
};

// POST /api/librarian/transactions/approve/:id  (approve a borrow request)
export const approveBookTransaction = async (req, res) => {
    try {
        const transaction = await BookTransaction.findById(req.params.id).populate("book");
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        transaction.status = "approved";
        transaction.librarian = req.session.user.id;
        await transaction.save();

        await Book.findByIdAndUpdate(transaction.book._id, { status: "borrowed" });
        await Student.findByIdAndUpdate(transaction.student, {
            $push: { borrowedBooks: transaction.book._id },
        });

        await createNotification(
            transaction.student,
            `Your borrow request for "${transaction.book.title}" has been approved`,
            "borrow_approved"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("approveBookTransaction error:", err);
        return res.status(500).json({ error: "Failed to approve transaction" });
    }
};

// POST /api/librarian/transactions/reject/:id  (reject a borrow request)
export const rejectBookTransaction = async (req, res) => {
    try {
        const transaction = await BookTransaction.findById(req.params.id).populate("book");
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        transaction.status = "cancelled";
        await transaction.save();

        await createNotification(
            transaction.student,
            `Your borrow request for "${transaction.book.title}" has been rejected`,
            "borrow_rejected"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("rejectBookTransaction error:", err);
        return res.status(500).json({ error: "Failed to reject transaction" });
    }
};

// POST /api/librarian/transactions/return/:id  (confirm a return request)
export const confirmReturn = async (req, res) => {
    try {
        const returnTransaction = await BookTransaction.findById(req.params.id).populate("book");
        if (!returnTransaction) return res.status(404).json({ error: "Transaction not found" });

        returnTransaction.status = "returned";
        returnTransaction.returnDate = new Date();
        returnTransaction.librarian = req.session.user.id;
        await returnTransaction.save();

        // Close out the matching approved borrow record.
        await BookTransaction.findOneAndUpdate(
            { book: returnTransaction.book._id, student: returnTransaction.student, status: "approved", transactionType: "borrow" },
            { status: "returned", returnDate: new Date() }
        );

        await Book.findByIdAndUpdate(returnTransaction.book._id, { status: "available" });
        await Student.findByIdAndUpdate(returnTransaction.student, {
            $pull: { borrowedBooks: returnTransaction.book._id },
        });

        await createNotification(
            returnTransaction.student,
            `Your return for "${returnTransaction.book.title}" has been confirmed.`,
            "borrow_approved"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("confirmReturn error:", err);
        return res.status(500).json({ error: "Failed to confirm return" });
    }
};

// POST /api/librarian/transactions/room/approve/:id
export const approveRoomTransaction = async (req, res) => {
    try {
        const transaction = await RoomTransaction.findById(req.params.id).populate("room");
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        transaction.status = "approved";
        transaction.approvedBy = req.session.user.id;
        await transaction.save();

        await Room.findByIdAndUpdate(transaction.room._id, {
            status: "reserved",
            reservee: transaction.reservee,
            reserveDate: transaction.reservationDate,
            reserveTimeStart: transaction.startTime,
            reserveTimeEnd: transaction.endTime,
        });

        await createNotification(
            transaction.reservee,
            `Your reservation for Room ${transaction.room.number} on ${new Date(transaction.reservationDate).toLocaleDateString()} has been approved.`,
            "borrow_approved"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("approveRoomTransaction error:", err);
        return res.status(500).json({ error: "Failed to approve reservation" });
    }
};

// POST /api/librarian/transactions/room/reject/:id
export const rejectRoomTransaction = async (req, res) => {
    try {
        const transaction = await RoomTransaction.findById(req.params.id).populate("room");
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        transaction.status = "rejected";
        await transaction.save();

        await createNotification(
            transaction.reservee,
            `Your reservation for Room ${transaction.room.number} has been rejected.`,
            "borrow_rejected"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("rejectRoomTransaction error:", err);
        return res.status(500).json({ error: "Failed to reject reservation" });
    }
};

// ---------------------------------------------------------------------------
// Book management
// ---------------------------------------------------------------------------

const BOOKS_PER_PAGE = 8;

// GET /api/librarian/books?page=&q=  -> { books, pagination, searchQuery }
export const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const q = req.query.q || "";
        const filter = createSearchFilter(q);

        const totalBooks = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * BOOKS_PER_PAGE)
            .limit(BOOKS_PER_PAGE);

        return res.json({
            books: books.map((b) => ({
                id: b._id,
                title: b.title,
                author: b.author,
                category: b.category,
                image: b.image,
                status: b.status,
                isbn: b.isbn,
                publisher: b.publisher,
                publishedYear: b.publishedYear,
                description: b.description,
                pdfUrl: b.pdfUrl,
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalBooks / BOOKS_PER_PAGE) || 1,
                totalBooks,
            },
            searchQuery: q,
        });
    } catch (err) {
        console.error("getBooks error:", err);
        return res.status(500).json({ error: "Failed to load books" });
    }
};

const splitList = (val) => (val || "").split(",").map((s) => s.trim()).filter(Boolean);

// POST /api/librarian/books  (multipart: image[required], pdf[optional])
export const addBook = async (req, res) => {
    try {
        const { title, author, category, description, isbn, publisher, publishedYear } = req.body || {};

        if (!title || !author || !category || !description) {
            return res.status(400).json({ error: "Title, author, category, and description are required" });
        }
        if (!req.files?.image?.[0]) {
            return res.status(400).json({ error: "A cover image is required" });
        }

        const book = await Book.create({
            title: title.trim(),
            author: splitList(author),
            category: splitList(category),
            image: req.files.image[0].location,
            pdfUrl: req.files?.pdf?.[0]?.location || null,
            description: description.trim(),
            isbn: isbn?.trim(),
            publisher: publisher?.trim(),
            publishedYear: publishedYear ? parseInt(publishedYear, 10) : null,
            status: "available",
        });

        return res.json({ success: true, id: book._id });
    } catch (err) {
        console.error("addBook error:", err);
        return res.status(500).json({ error: "Failed to add book" });
    }
};

// POST /api/librarian/books/:id  (multipart: image[optional], pdf[optional])
export const editBook = async (req, res) => {
    try {
        const existing = await Book.findById(req.params.id);
        if (!existing) return res.status(404).json({ error: "Book not found" });

        const { title, author, category, description, isbn, publisher, publishedYear, status } = req.body || {};

        await Book.findByIdAndUpdate(req.params.id, {
            title: title?.trim() ?? existing.title,
            author: author ? splitList(author) : existing.author,
            category: category ? splitList(category) : existing.category,
            // Keep the current file if a new one wasn't uploaded.
            image: req.files?.image?.[0]?.location || existing.image,
            pdfUrl: req.files?.pdf?.[0]?.location || existing.pdfUrl,
            description: description?.trim() ?? existing.description,
            isbn: isbn?.trim(),
            publisher: publisher?.trim(),
            publishedYear: publishedYear ? parseInt(publishedYear, 10) : null,
            status: status || existing.status,
        });

        return res.json({ success: true });
    } catch (err) {
        console.error("editBook error:", err);
        return res.status(500).json({ error: "Failed to update book" });
    }
};

// POST /api/librarian/books/:id/delete
export const deleteBook = async (req, res) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Book not found" });
        return res.json({ success: true });
    } catch (err) {
        console.error("deleteBook error:", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
};