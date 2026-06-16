import LibrarianNotification from "../../models/librarianNotification.model.js";
import BookTransaction from "../../models/bookTransaction.model.js";
import RoomTransaction from "../../models/roomTransaction.model.js";
import Book from "../../models/book.model.js";
import Student from "../../models/student.model.js";
import Room from "../../models/room.model.js";
import Librarian from "../../models/librarian.model.js";
import { createNotification } from "../helpers/notification.helper.js";
import { createSearchFilter } from "../helpers/book.helper.js";
import { verifyPassword, hashPassword } from "../helpers/password.helper.js";

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

// ---------------------------------------------------------------------------
// Students list
// ---------------------------------------------------------------------------

const STUDENTS_PER_PAGE = 10;

// GET /api/librarian/students?page=&q=  -> { students, pagination, searchQuery }
export const getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const q = req.query.q || "";

        const filter = q
            ? {
                $or: [
                    { firstName: { $regex: q, $options: "i" } },
                    { lastName: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } },
                    { studentId: { $regex: q, $options: "i" } },
                ],
            }
            : {};

        const totalStudents = await Student.countDocuments(filter);
        const students = await Student.find(filter)
            .sort({ lastName: 1 })
            .skip((page - 1) * STUDENTS_PER_PAGE)
            .limit(STUDENTS_PER_PAGE);

        return res.json({
            students: students.map((s) => ({
                id: s._id,
                studentId: s.studentId,
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email,
                sex: s.sex,
                profilePicture: s.profilePicture || null,
                canBorrow: s.canBorrow,
                fines: s.fines || 0,
                borrowedCount: s.borrowedBooks?.length || 0,
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalStudents / STUDENTS_PER_PAGE) || 1,
                totalStudents,
            },
            searchQuery: q,
        });
    } catch (err) {
        console.error("getStudents error:", err);
        return res.status(500).json({ error: "Failed to load students" });
    }
};

// ---------------------------------------------------------------------------
// Manual transactions + settle fines
// ---------------------------------------------------------------------------

// GET /api/librarian/manual/options -> available books + rooms for the dropdowns
export const getManualOptions = async (req, res) => {
    try {
        const availableBooks = await Book.find({ status: "available" }).select("title").sort({ title: 1 });
        const rooms = await Room.find({ status: "available" }).select("number").sort({ number: 1 });
        return res.json({
            availableBooks: availableBooks.map((b) => ({ id: b._id, title: b.title })),
            rooms: rooms.map((r) => ({ id: r._id, number: r.number })),
        });
    } catch (err) {
        console.error("getManualOptions error:", err);
        return res.status(500).json({ error: "Failed to load options" });
    }
};

// GET /api/librarian/students/:id/borrowed -> the books a student currently holds
export const getStudentBorrowed = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("borrowedBooks", "title");
        if (!student) return res.status(404).json({ error: "Student not found" });
        return res.json({
            books: (student.borrowedBooks || []).map((b) => ({ id: b._id, title: b.title })),
        });
    } catch (err) {
        console.error("getStudentBorrowed error:", err);
        return res.status(500).json({ error: "Failed to load borrowed books" });
    }
};

const generateReference = () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// POST /api/librarian/transactions/manual -> borrow | return | room (JSON, not redirect)
export const manualTransaction = async (req, res) => {
    try {
        const {
            type, studentId, bookId, dueDate,
            roomId, reservationDate, startTime, endTime, purpose, attendeesCount,
        } = req.body || {};
        const librarianId = req.session.user.id;

        if (!studentId) return res.status(400).json({ error: "Please select a student" });

        if (type === "borrow") {
            if (!bookId || !dueDate) return res.status(400).json({ error: "Select a book and a due date" });

            const book = await Book.findById(bookId);
            if (!book || book.status === "borrowed") return res.status(400).json({ error: "Book is unavailable" });

            const referenceNumber = generateReference();
            await BookTransaction.create({
                referenceNumber,
                book: bookId,
                student: studentId,
                librarian: librarianId,
                transactionType: "borrow",
                status: "approved",
                dueDate: new Date(dueDate),
            });
            await Book.findByIdAndUpdate(bookId, { status: "borrowed" });
            await Student.findByIdAndUpdate(studentId, { $push: { borrowedBooks: bookId } });
            await createNotification(
                studentId,
                `A librarian has processed a borrow transaction for "${book.title}" on your behalf.`,
                "borrow_approved"
            );
            return res.json({ success: true, referenceNumber });
        }

        if (type === "return") {
            if (!bookId) return res.status(400).json({ error: "Select a book to return" });

            const borrowTxn = await BookTransaction.findOne({
                student: studentId,
                book: bookId,
                status: "approved",
                transactionType: "borrow",
            }).populate("book");

            if (!borrowTxn) return res.status(400).json({ error: "No active borrow found for this student and book" });

            borrowTxn.status = "returned";
            borrowTxn.returnDate = new Date();
            borrowTxn.librarian = librarianId;
            await borrowTxn.save();

            await Book.findByIdAndUpdate(bookId, { status: "available" });
            await Student.findByIdAndUpdate(studentId, { $pull: { borrowedBooks: bookId } });
            await createNotification(
                studentId,
                `A librarian has processed the return of "${borrowTxn.book.title}" on your behalf.`,
                "borrow_approved"
            );
            return res.json({ success: true });
        }

        if (type === "room") {
            if (!roomId || !reservationDate || !startTime || !endTime) {
                return res.status(400).json({ error: "Fill in all room reservation fields" });
            }

            const room = await Room.findById(roomId);
            if (!room || room.status !== "available") return res.status(400).json({ error: "Room is not available" });

            await RoomTransaction.create({
                reservee: studentId,
                room: roomId,
                reservationDate: new Date(reservationDate),
                startTime,
                endTime,
                purpose: purpose || "",
                attendeesCount: attendeesCount || 1,
                status: "approved",
                approvedBy: librarianId,
            });
            await Room.findByIdAndUpdate(roomId, {
                status: "reserved",
                reservee: studentId,
                reserveDate: new Date(reservationDate),
                reserveTimeStart: startTime,
                reserveTimeEnd: endTime,
            });
            await createNotification(
                studentId,
                `A librarian has reserved Room ${room.number} for you on ${new Date(reservationDate).toLocaleDateString()}.`,
                "borrow_approved"
            );
            return res.json({ success: true });
        }

        return res.status(400).json({ error: "Invalid transaction type" });
    } catch (err) {
        console.error("manualTransaction error:", err);
        return res.status(500).json({ error: "Failed to process transaction" });
    }
};

// POST /api/librarian/transactions/settle-fines -> zero fines + restore borrowing
export const settleFines = async (req, res) => {
    try {
        const { studentId } = req.body || {};
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const fineAmount = student.fines || 0;
        const wasRevoked = !student.canBorrow;

        await Student.findByIdAndUpdate(studentId, { fines: 0, canBorrow: true });

        const message = wasRevoked
            ? `Your fines of ₱${fineAmount} have been settled. Your borrowing privileges have been restored.`
            : `Your fines of ₱${fineAmount} have been settled by the librarian.`;
        await createNotification(studentId, message, "fine");

        return res.json({ success: true });
    } catch (err) {
        console.error("settleFines error:", err);
        return res.status(500).json({ error: "Failed to settle fines" });
    }
};

// ---------------------------------------------------------------------------
// Librarian profile
// ---------------------------------------------------------------------------

// GET /api/librarian/profile -> { profile }
export const getLibrarianProfile = async (req, res) => {
    try {
        const librarian = await Librarian.findById(req.session.user.id);
        if (!librarian) return res.status(404).json({ error: "Librarian not found" });

        return res.json({
            profile: {
                id: librarian._id,
                firstName: librarian.firstName,
                lastName: librarian.lastName,
                email: librarian.email,
                sex: librarian.sex,
                married: librarian.married,
                profilePicture: librarian.profilePicture || null,
            },
        });
    } catch (err) {
        console.error("getLibrarianProfile error:", err);
        return res.status(500).json({ error: "Failed to load profile" });
    }
};

// POST /api/librarian/profile/update  body: { firstName, lastName, email, sex, married }
export const updateLibrarianProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, sex, married } = req.body || {};
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "First name, last name, and email are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const emailTaken = await Librarian.findOne({
            email: normalizedEmail,
            _id: { $ne: req.session.user.id },
        });
        if (emailTaken) return res.status(409).json({ error: "Email is already in use" });

        await Librarian.findByIdAndUpdate(req.session.user.id, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            sex,
            married: typeof married === "boolean" ? married : married === "on" || married === "true",
        });

        // Keep the session user in sync so the header reflects the change.
        req.session.user.name = firstName.trim();
        req.session.user.lastName = lastName.trim();
        req.session.user.email = normalizedEmail;
        req.session.user.sex = sex;

        return res.json({ success: true, user: req.session.user });
    } catch (err) {
        console.error("updateLibrarianProfile error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
    }
};

// POST /api/librarian/profile/password  body: { currentPassword, newPassword, confirmPassword }
export const changeLibrarianPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body || {};

        const librarian = await Librarian.findById(req.session.user.id);
        if (!librarian) return res.status(404).json({ error: "Librarian not found" });

        const ok = await verifyPassword(currentPassword, librarian.password);
        if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "New passwords do not match" });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Store hashed (the legacy EJS stored plaintext — upgrade on change).
        librarian.password = await hashPassword(newPassword);
        await librarian.save();

        return res.json({ success: true });
    } catch (err) {
        console.error("changeLibrarianPassword error:", err);
        return res.status(500).json({ error: "Failed to change password" });
    }
};

// POST /api/librarian/profile/picture  (multipart: profilePicture) -> { success, profilePicture }
export const uploadLibrarianProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        await Librarian.findByIdAndUpdate(req.session.user.id, { profilePicture: req.file.location });
        req.session.user.profilePicture = req.file.location;

        return res.json({ success: true, profilePicture: req.file.location });
    } catch (err) {
        console.error("uploadLibrarianProfilePicture error:", err);
        return res.status(500).json({ error: "Failed to upload picture" });
    }
};