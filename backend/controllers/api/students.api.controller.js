import Student from "../../models/student.model.js";
import Book from "../../models/book.model.js";
import Bag from "../../models/bag.model.js";
import BookTransaction from "../../models/bookTransaction.model.js";
import Room from "../../models/room.model.js";
import RoomTransaction from "../../models/roomTransaction.model.js";
import Notification from "../../models/notification.model.js";
import { createLibrarianNotification } from "../helpers/librarianNotification.helper.js";
import { createNotification } from "../helpers/notification.helper.js";
import { verifyPassword, hashPassword } from "../helpers/password.helper.js";

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
            // Only decrement when likes > 0 so the counter can never go negative.
            await Book.findOneAndUpdate({ _id: bookId, likes: { $gt: 0 } }, { $inc: { likes: -1 } });
        } else {
            await Student.findByIdAndUpdate(studentId, { $push: { likedBooks: bookId } });
            await Book.findByIdAndUpdate(bookId, { $inc: { likes: 1 } });
        }

        const book = await Book.findById(bookId).select("likes");
        return res.json({ liked: !alreadyLiked, likes: Math.max(0, book?.likes ?? 0) });
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

// GET /api/students/bag  -> { items: [{ book, dueDate }] }
export const getBag = async (req, res) => {
    try {
        const bag = await Bag.findOne({ student: req.session.user.id }).populate("items.book");
        return res.json({ items: bag ? bag.items : [] });
    } catch (err) {
        console.error("getBag error:", err);
        return res.status(500).json({ error: "Failed to load bag" });
    }
};

// POST /api/students/bag/remove/:bookId  -> { success }
export const removeFromBag = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const { bookId } = req.params;

        const bag = await Bag.findOne({ student: studentId });
        if (bag) {
            bag.items = bag.items.filter((item) => item.book.toString() !== bookId);
            await bag.save();
        }
        return res.json({ success: true });
    } catch (err) {
        console.error("removeFromBag error:", err);
        return res.status(500).json({ error: "Failed to remove item" });
    }
};

// POST /api/students/bag/borrow-all  -> { success, borrowed }
// Creates a pending borrow request for every available item, then empties the bag.
export const borrowFromBag = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const bag = await Bag.findOne({ student: studentId }).populate("items.book");

        if (!bag || bag.items.length === 0) return res.json({ success: true, borrowed: 0 });

        let borrowed = 0;
        for (const item of bag.items) {
            const book = item.book;
            if (!book || book.status === "borrowed") continue;

            const existing = await BookTransaction.findOne({
                book: book._id,
                student: studentId,
                status: "pending",
                transactionType: "borrow",
            });
            if (existing) continue;

            await BookTransaction.create({
                referenceNumber: generateReference(),
                book: book._id,
                student: studentId,
                librarian: null,
                transactionType: "borrow",
                status: "pending",
                dueDate: item.dueDate,
            });
            borrowed++;
        }

        bag.items = [];
        await bag.save();
        return res.json({ success: true, borrowed });
    } catch (err) {
        console.error("borrowFromBag error:", err);
        return res.status(500).json({ error: "Failed to borrow items" });
    }
};

// GET /api/students/borrowed  -> { transactions: [...] }
export const getBorrowed = async (req, res) => {
    try {
        const studentId = req.session.user.id;

        const pendingReturns = await BookTransaction.find({
            student: studentId,
            transactionType: "return",
            status: "pending",
        }).distinct("book");

        const transactions = await BookTransaction.find({
            student: studentId,
            status: { $in: ["approved", "overdue"] },
        }).populate("book");

        const now = new Date();
        const result = transactions.map((txn) => ({
            ...txn.toObject(),
            pendingReturn: pendingReturns.some((id) => id.equals(txn.book._id)),
            status: txn.status === "approved" && txn.dueDate < now ? "overdue" : txn.status,
        }));

        return res.json({ transactions: result });
    } catch (err) {
        console.error("getBorrowed error:", err);
        return res.status(500).json({ error: "Failed to load borrowed books" });
    }
};

// POST /api/students/return  body: { transactionId }  -> { success }
export const returnBook = async (req, res) => {
    try {
        const { transactionId } = req.body || {};
        const studentId = req.session.user.id;

        const transaction = await BookTransaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        const existingReturn = await BookTransaction.findOne({
            book: transaction.book,
            student: studentId,
            transactionType: "return",
            status: "pending",
        });
        if (existingReturn)
            return res.status(409).json({ error: "You already requested a return for this book." });

        await BookTransaction.create({
            referenceNumber: generateReference(),
            book: transaction.book,
            student: studentId,
            transactionType: "return",
            status: "pending",
            dueDate: transaction.dueDate,
        });

        await createLibrarianNotification(
            `New return request for a book from ${req.session.user.name} ${req.session.user.lastName}.`,
            "return_request"
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("returnBook error:", err);
        return res.status(500).json({ error: "Failed to request return" });
    }
};

// GET /api/students/profile  -> { profile }
export const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        return res.json({
            profile: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                sex: student.sex,
                studentId: student.studentId,
                profilePicture: student.profilePicture || null,
                canBorrow: student.canBorrow,
                fines: student.fines || 0,
                borrowedCount: student.borrowedBooks?.length || 0,
                likedCount: student.likedBooks?.length || 0,
            },
        });
    } catch (err) {
        console.error("getProfile error:", err);
        return res.status(500).json({ error: "Failed to load profile" });
    }
};

// POST /api/students/profile  body: { firstName, lastName, email, sex }  -> { success, user }
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, sex } = req.body || {};
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "First name, last name, and email are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const emailTaken = await Student.findOne({
            email: normalizedEmail,
            _id: { $ne: req.session.user.id },
        });
        if (emailTaken) return res.status(409).json({ error: "Email is already in use" });

        await Student.findByIdAndUpdate(req.session.user.id, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            sex,
        });

        // Keep the session user in sync so the header reflects the change.
        req.session.user.name = firstName.trim();
        req.session.user.lastName = lastName.trim();
        req.session.user.email = normalizedEmail;
        req.session.user.sex = sex;

        return res.json({ success: true, user: req.session.user });
    } catch (err) {
        console.error("updateProfile error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
    }
};

// POST /api/students/profile/password  body: { currentPassword, newPassword, confirmPassword }
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body || {};

        const student = await Student.findById(req.session.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const ok = await verifyPassword(currentPassword, student.password);
        if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

        if (newPassword !== confirmPassword)
            return res.status(400).json({ error: "New passwords do not match" });
        if (!newPassword || newPassword.length < 6)
            return res.status(400).json({ error: "Password must be at least 6 characters" });

        student.password = await hashPassword(newPassword);
        await student.save();

        return res.json({ success: true });
    } catch (err) {
        console.error("changePassword error:", err);
        return res.status(500).json({ error: "Failed to change password" });
    }
};

// POST /api/students/profile/picture  (multipart: profilePicture)  -> { success, profilePicture }
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        await Student.findByIdAndUpdate(req.session.user.id, { profilePicture: req.file.location });
        req.session.user.profilePicture = req.file.location;

        return res.json({ success: true, profilePicture: req.file.location });
    } catch (err) {
        console.error("uploadProfilePicture error:", err);
        return res.status(500).json({ error: "Failed to upload picture" });
    }
};

// ---------------------------------------------------------------------------
// Rooms / reservations
// ---------------------------------------------------------------------------

// GET /api/students/rooms  -> { rooms }
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ number: 1 });
        return res.json({
            rooms: rooms.map((r) => ({
                id: r._id,
                number: r.number,
                capacity: r.capacity,
                status: r.status,
            })),
        });
    } catch (err) {
        console.error("getRooms error:", err);
        return res.status(500).json({ error: "Failed to load rooms" });
    }
};

// POST /api/students/rooms/reserve
// body: { roomId, reservationDate, startTime, endTime, purpose, attendeesCount, invites: [studentId] }
export const reserveRoom = async (req, res) => {
    try {
        const {
            roomId,
            reservationDate,
            startTime,
            endTime,
            purpose,
            attendeesCount,
            invites,
        } = req.body || {};

        if (!roomId || !reservationDate || !startTime || !endTime) {
            return res.status(400).json({ error: "Room, date, start time, and end time are required" });
        }
        if (endTime <= startTime) {
            return res.status(400).json({ error: "End time must be after start time" });
        }

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });
        if (room.status !== "available") {
            return res.status(400).json({ error: "Room is not available" });
        }

        // Overlap check against other pending/approved reservations for this room/date.
        const conflict = await RoomTransaction.findOne({
            room: roomId,
            reservationDate: new Date(reservationDate),
            status: { $in: ["pending", "approved"] },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
        });
        if (conflict) {
            return res.status(409).json({ error: "That time slot is already booked" });
        }

        const inviteIds = Array.isArray(invites) ? invites.filter(Boolean) : [];

        const transaction = await RoomTransaction.create({
            reservee: req.session.user.id,
            room: roomId,
            reservationDate: new Date(reservationDate),
            startTime,
            endTime,
            purpose: purpose?.trim() || undefined,
            attendeesCount: parseInt(attendeesCount, 10) || 1,
            invites: inviteIds.map((id) => ({ student: id, status: "pending" })),
        });

        // Notify invited students.
        for (const studentId of inviteIds) {
            await createNotification(
                studentId,
                `You have been invited to a room reservation for Room ${room.number} on ${new Date(reservationDate).toLocaleDateString()}.`,
                "borrow_approved"
            );
        }

        return res.json({ success: true, transactionId: transaction._id });
    } catch (err) {
        console.error("reserveRoom error:", err);
        return res.status(500).json({ error: "Failed to reserve room" });
    }
};

// GET /api/students/reservations  -> { reservations }  (pending + approved)
export const getReservations = async (req, res) => {
    try {
        const reservations = await RoomTransaction.find({
            reservee: req.session.user.id,
            status: { $in: ["pending", "approved"] },
        })
            .populate("room")
            .sort({ reservationDate: 1 });

        return res.json({
            reservations: reservations.map((r) => ({
                id: r._id,
                room: r.room ? { number: r.room.number, capacity: r.room.capacity } : null,
                reservationDate: r.reservationDate,
                startTime: r.startTime,
                endTime: r.endTime,
                purpose: r.purpose || null,
                attendeesCount: r.attendeesCount,
                status: r.status,
            })),
        });
    } catch (err) {
        console.error("getReservations error:", err);
        return res.status(500).json({ error: "Failed to load reservations" });
    }
};

// POST /api/students/reservations/cancel/:id  -> { success }
export const cancelReservation = async (req, res) => {
    try {
        const reservation = await RoomTransaction.findById(req.params.id);
        if (!reservation) return res.status(404).json({ error: "Reservation not found" });

        // Ownership check (the EJS route omitted this).
        if (String(reservation.reservee) !== String(req.session.user.id)) {
            return res.status(403).json({ error: "Not your reservation" });
        }

        const wasApproved = reservation.status === "approved";
        reservation.status = "cancelled";
        await reservation.save();

        // If it had locked a room, free it again.
        if (wasApproved) {
            await Room.findByIdAndUpdate(reservation.room, {
                status: "available",
                reservee: null,
                reserveDate: null,
                reserveTimeStart: null,
                reserveTimeEnd: null,
            });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error("cancelReservation error:", err);
        return res.status(500).json({ error: "Failed to cancel reservation" });
    }
};

// GET /api/students/search?q=  -> { students }  (for room invites)
export const searchStudents = async (req, res) => {
    try {
        const query = req.query.q || "";
        const currentId = req.session.user?.id;

        const students = await Student.find({
            _id: { $ne: currentId },
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { studentId: { $regex: query, $options: "i" } },
            ],
        })
            .select("firstName lastName email studentId")
            .limit(5);

        return res.json({
            students: students.map((s) => ({
                id: s._id,
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email,
                studentId: s.studentId,
            })),
        });
    } catch (err) {
        console.error("searchStudents error:", err);
        return res.status(500).json({ error: "Search failed" });
    }
};

// GET /api/students/liked  -> { books }
export const getLiked = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user.id).populate("likedBooks");
        if (!student) return res.status(404).json({ error: "Student not found" });

        return res.json({
            books: (student.likedBooks || []).map((b) => ({
                id: b._id,
                title: b.title,
                author: b.author,
                category: b.category,
                image: b.image,
                status: b.status,
            })),
        });
    } catch (err) {
        console.error("getLiked error:", err);
        return res.status(500).json({ error: "Failed to load liked books" });
    }
};

// ---------------------------------------------------------------------------
// History & Status
// ---------------------------------------------------------------------------

const FINE_PER_DAY = 4;

// GET /api/students/history  -> { bookHistory, roomHistory }
export const getHistory = async (req, res) => {
    try {
        const studentId = req.session.user.id;

        const [bookHistory, roomHistory] = await Promise.all([
            BookTransaction.find({
                student: studentId,
                transactionType: "borrow",
                status: { $in: ["returned", "cancelled"] },
            }).populate("book").sort({ createdAt: -1 }),

            RoomTransaction.find({
                reservee: studentId,
                status: { $in: ["completed", "cancelled", "rejected"] },
            }).populate("room").sort({ createdAt: -1 }),
        ]);

        return res.json({
            bookHistory: bookHistory
                .filter((t) => t.book)
                .map((t) => ({
                    id: t._id,
                    book: { title: t.book.title, author: t.book.author, image: t.book.image },
                    transactionType: t.transactionType,
                    createdAt: t.createdAt,
                    fineAmount: t.fineAmount || 0,
                    status: t.status,
                })),
            roomHistory: roomHistory
                .filter((r) => r.room)
                .map((r) => ({
                    id: r._id,
                    room: { number: r.room.number },
                    reservationDate: r.reservationDate,
                    startTime: r.startTime,
                    endTime: r.endTime,
                    purpose: r.purpose || null,
                    status: r.status,
                })),
        });
    } catch (err) {
        console.error("getHistory error:", err);
        return res.status(500).json({ error: "Failed to load history" });
    }
};

// GET /api/students/status  -> { fines, overdueBooks }
export const getStatus = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const now = new Date();
        const overdue = await BookTransaction.find({
            student: req.session.user.id,
            status: { $in: ["approved", "overdue"] },
            dueDate: { $lt: now },
        }).populate("book");

        let extraFines = 0;
        const overdueBooks = overdue
            .filter((t) => t.book)
            .map((txn) => {
                const daysOverdue = Math.floor((now - txn.dueDate) / (1000 * 60 * 60 * 24));
                const computedFine = daysOverdue * FINE_PER_DAY;
                extraFines += computedFine - (txn.fineAmount || 0);
                return {
                    id: txn._id,
                    book: { title: txn.book.title, author: txn.book.author, image: txn.book.image },
                    dueDate: txn.dueDate,
                    fineAmount: computedFine,
                };
            });

        const fines = (student.fines || 0) + extraFines;

        return res.json({ fines, overdueBooks });
    } catch (err) {
        console.error("getStatus error:", err);
        return res.status(500).json({ error: "Failed to load status" });
    }
};

// ---------------------------------------------------------------------------
// Student notifications
// ---------------------------------------------------------------------------

// GET /api/students/notifications  -> { notifications, unreadCount }
export const getStudentNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            student: req.session.user.id,
            isRead: false,
        }).sort({ createdAt: -1 }).limit(10);

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
        console.error("getStudentNotifications error:", err);
        return res.status(500).json({ error: "Failed to load notifications" });
    }
};

// POST /api/students/notifications/read/:id  -> { success }
export const markStudentNotificationRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        return res.json({ success: true });
    } catch (err) {
        console.error("markStudentNotificationRead error:", err);
        return res.status(500).json({ error: "Failed to update notification" });
    }
};

// POST /api/students/notifications/clear  -> { success }
export const clearStudentNotifications = async (req, res) => {
    try {
        await Notification.updateMany(
            { student: req.session.user.id, isRead: false },
            { isRead: true }
        );
        return res.json({ success: true });
    } catch (err) {
        console.error("clearStudentNotifications error:", err);
        return res.status(500).json({ error: "Failed to clear notifications" });
    }
};