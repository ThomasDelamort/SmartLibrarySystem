import Student from "../../models/student.model.js";
import Librarian from "../../models/librarian.model.js";
import Book from "../../models/book.model.js";
import BookTransaction from "../../models/bookTransaction.model.js";
import RoomTransaction from "../../models/roomTransaction.model.js";
import Room from "../../models/room.model.js";
import UserSession from "../../models/userSession.model.js";

// ---------------------------------------------------------------------------
// Dashboard overview
// ---------------------------------------------------------------------------

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
    try {
        const [
            totalStudents, totalLibrarians, totalBooks,
            recentStudents, recentLibrarians, mostBorrowed,
            processedReservations, cancelledReservations, recentActivity, mostLiked,
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
                { $limit: 5 },
                { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
                { $unwind: "$book" },
            ]),
            RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] } }),
            RoomTransaction.countDocuments({ status: "cancelled" }),
            BookTransaction.find({ status: "pending" })
                .populate("book").populate("student")
                .sort({ createdAt: -1 }).limit(5),
            Book.find().sort({ likes: -1 }).limit(5),
        ]);

        return res.json({
            stats: { totalStudents, totalLibrarians, totalBooks },
            reservations: { processed: processedReservations, cancelled: cancelledReservations },
            recentStudents: recentStudents.map((s) => ({
                id: s._id, name: `${s.firstName} ${s.lastName}`, email: s.email,
                profilePicture: s.profilePicture || null, createdAt: s.createdAt,
            })),
            recentLibrarians: recentLibrarians.map((l) => ({
                id: l._id, name: `${l.firstName} ${l.lastName}`, email: l.email,
                profilePicture: l.profilePicture || null, createdAt: l.createdAt,
            })),
            mostBorrowed: mostBorrowed.map((m) => ({
                id: m.book._id, title: m.book.title, image: m.book.image, count: m.count,
            })),
            mostLiked: mostLiked.map((b) => ({
                id: b._id, title: b.title, image: b.image, likes: Math.max(0, b.likes || 0),
            })),
            recentActivity: recentActivity.map((t) => ({
                id: t._id,
                student: t.student ? `${t.student.firstName} ${t.student.lastName}` : "Unknown",
                book: t.book ? t.book.title : "Unknown",
                status: t.status,
                createdAt: t.createdAt,
            })),
        });
    } catch (err) {
        console.error("getDashboard error:", err);
        return res.status(500).json({ error: "Failed to load dashboard" });
    }
};

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

// GET /api/admin/chart/traffic?days=14
export const chartTraffic = async (req, res) => {
    try {
        const days = parseInt(req.query.days, 10) || 14;
        const now = new Date();
        const labels = [], students = [], librarians = [];

        for (let i = days - 1; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            labels.push(dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

            const [sCount, lCount] = await Promise.all([
                UserSession.countDocuments({ userRole: "student", timeIn: { $gte: dayStart, $lte: dayEnd } }),
                UserSession.countDocuments({ userRole: "librarian", timeIn: { $gte: dayStart, $lte: dayEnd } }),
            ]);
            students.push(sCount);
            librarians.push(lCount);
        }

        return res.json({ labels, students, librarians });
    } catch (err) {
        console.error("chartTraffic error:", err);
        return res.status(500).json({ error: "Failed to load traffic data" });
    }
};

// GET /api/admin/chart/reservations?mode=weekly|monthly
export const chartReservations = async (req, res) => {
    try {
        const mode = req.query.mode || "weekly";
        const now = new Date();
        const labels = [], processed = [], cancelled = [];

        if (mode === "weekly") {
            for (let w = 3; w >= 0; w--) {
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - (w + 1) * 7);
                weekStart.setHours(0, 0, 0, 0);
                const weekEnd = new Date(now);
                weekEnd.setDate(now.getDate() - w * 7);
                weekEnd.setHours(23, 59, 59, 999);

                labels.push(`Week ${4 - w}`);
                const [p, c] = await Promise.all([
                    RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] }, createdAt: { $gte: weekStart, $lte: weekEnd } }),
                    RoomTransaction.countDocuments({ status: "cancelled", createdAt: { $gte: weekStart, $lte: weekEnd } }),
                ]);
                processed.push(p);
                cancelled.push(c);
            }
        } else {
            for (let m = 3; m >= 0; m--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - m, 1, 0, 0, 0, 0);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59, 999);

                labels.push(monthStart.toLocaleDateString("en-US", { month: "short" }));
                const [p, c] = await Promise.all([
                    RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] }, createdAt: { $gte: monthStart, $lte: monthEnd } }),
                    RoomTransaction.countDocuments({ status: "cancelled", createdAt: { $gte: monthStart, $lte: monthEnd } }),
                ]);
                processed.push(p);
                cancelled.push(c);
            }
        }

        return res.json({ labels, processed, cancelled });
    } catch (err) {
        console.error("chartReservations error:", err);
        return res.status(500).json({ error: "Failed to load reservation data" });
    }
};

// ---------------------------------------------------------------------------
// Students management
// ---------------------------------------------------------------------------

// GET /api/admin/students?q=
export const getStudents = async (req, res) => {
    try {
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

        const students = await Student.find(filter).sort({ createdAt: -1 });
        return res.json({
            students: students.map((s) => ({
                id: s._id,
                firstName: s.firstName,
                lastName: s.lastName,
                studentId: s.studentId,
                email: s.email,
                fines: s.fines || 0,
                canBorrow: s.canBorrow,
            })),
            searchQuery: q,
        });
    } catch (err) {
        console.error("admin getStudents error:", err);
        return res.status(500).json({ error: "Failed to load students" });
    }
};

// POST /api/admin/students/:id/toggle-borrow -> { success, canBorrow }
export const toggleCanBorrow = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            { canBorrow: !student.canBorrow },
            { new: true }
        );
        return res.json({ success: true, canBorrow: updated.canBorrow });
    } catch (err) {
        console.error("toggleCanBorrow error:", err);
        return res.status(500).json({ error: "Failed to update student" });
    }
};

// POST /api/admin/students/:id/delete
export const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (err) {
        console.error("admin deleteStudent error:", err);
        return res.status(500).json({ error: "Failed to delete student" });
    }
};

// ---------------------------------------------------------------------------
// Librarians management
// ---------------------------------------------------------------------------

// GET /api/admin/librarians
export const getLibrarians = async (req, res) => {
    try {
        const librarians = await Librarian.find().sort({ createdAt: -1 });
        return res.json({
            librarians: librarians.map((l) => ({
                id: l._id,
                firstName: l.firstName,
                lastName: l.lastName,
                email: l.email,
                sex: l.sex,
                createdAt: l.createdAt,
            })),
        });
    } catch (err) {
        console.error("admin getLibrarians error:", err);
        return res.status(500).json({ error: "Failed to load librarians" });
    }
};

// POST /api/admin/librarians/:id/delete
export const deleteLibrarian = async (req, res) => {
    try {
        await Librarian.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (err) {
        console.error("admin deleteLibrarian error:", err);
        return res.status(500).json({ error: "Failed to delete librarian" });
    }
};

// ---------------------------------------------------------------------------
// Books management
// ---------------------------------------------------------------------------

// GET /api/admin/books?q=  -> { books, mostBorrowed, mostLiked, searchQuery }
export const getBooks = async (req, res) => {
    try {
        const q = req.query.q || "";
        const filter = q
            ? {
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { author: { $elemMatch: { $regex: q, $options: "i" } } },
                ],
            }
            : {};

        const [books, mostBorrowed, mostLiked] = await Promise.all([
            Book.find(filter).sort({ createdAt: -1 }),
            BookTransaction.aggregate([
                { $match: { transactionType: "borrow", status: { $in: ["approved", "returned"] } } },
                { $group: { _id: "$book", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
                { $unwind: "$book" },
            ]),
            Book.find().sort({ likes: -1 }).limit(5),
        ]);

        const authorText = (a) => (Array.isArray(a) ? a.join(", ") : a || "");

        return res.json({
            books: books.map((b) => ({
                id: b._id,
                title: b.title,
                author: authorText(b.author),
                category: Array.isArray(b.category) ? b.category.join(", ") : b.category || "",
                image: b.image,
                status: b.status,
                likes: Math.max(0, b.likes || 0),
            })),
            mostBorrowed: mostBorrowed.map((m) => ({
                id: m.book._id, title: m.book.title, author: authorText(m.book.author), count: m.count,
            })),
            mostLiked: mostLiked.map((b) => ({
                id: b._id, title: b.title, author: authorText(b.author), likes: Math.max(0, b.likes || 0),
            })),
            searchQuery: q,
        });
    } catch (err) {
        console.error("admin getBooks error:", err);
        return res.status(500).json({ error: "Failed to load books" });
    }
};

// POST /api/admin/books/:id/delete
export const deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (err) {
        console.error("admin deleteBook error:", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
};

// ---------------------------------------------------------------------------
// Rooms management
// ---------------------------------------------------------------------------

const mapRoom = (r) => ({
    id: r._id,
    number: r.number,
    capacity: r.capacity,
    description: r.description || "",
    status: r.status,
});

// GET /api/admin/rooms -> { rooms }
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ number: 1 });
        return res.json({ rooms: rooms.map(mapRoom) });
    } catch (err) {
        console.error("admin getRooms error:", err);
        return res.status(500).json({ error: "Failed to load rooms" });
    }
};

// POST /api/admin/rooms  body: { number, capacity, description }
export const addRoom = async (req, res) => {
    try {
        const { number, capacity, description } = req.body || {};
        if (!number || !capacity) return res.status(400).json({ error: "Room number and capacity are required" });

        const room = await Room.create({
            number: String(number).trim(),
            capacity: parseInt(capacity, 10),
            description: description?.trim() || "",
            status: "available",
        });
        return res.json({ success: true, room: mapRoom(room) });
    } catch (err) {
        console.error("admin addRoom error:", err);
        return res.status(500).json({ error: "Failed to add room" });
    }
};

// POST /api/admin/rooms/:id/delete
export const deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (err) {
        console.error("admin deleteRoom error:", err);
        return res.status(500).json({ error: "Failed to delete room" });
    }
};

// POST /api/admin/rooms/:id/status  body: { status }
export const updateRoomStatus = async (req, res) => {
    try {
        const { status } = req.body || {};
        const allowed = ["available", "reserved", "maintenance"];
        if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

        await Room.findByIdAndUpdate(req.params.id, { status });
        return res.json({ success: true, status });
    } catch (err) {
        console.error("admin updateRoomStatus error:", err);
        return res.status(500).json({ error: "Failed to update room" });
    }
};