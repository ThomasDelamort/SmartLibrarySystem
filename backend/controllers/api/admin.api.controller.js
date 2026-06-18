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

// ---------------------------------------------------------------------------
// Transactions (read-only) + reports
// ---------------------------------------------------------------------------

// GET /api/admin/transactions -> { bookTransactions, roomTransactions }
export const getTransactions = async (req, res) => {
    try {
        const [bookTransactions, roomTransactions] = await Promise.all([
            BookTransaction.find().populate("book").populate("student").sort({ createdAt: -1 }).limit(50),
            RoomTransaction.find().populate("room").populate("reservee").sort({ createdAt: -1 }).limit(50),
        ]);

        return res.json({
            bookTransactions: bookTransactions.map((t) => ({
                id: t._id,
                student: t.student ? `${t.student.firstName} ${t.student.lastName}` : "Unknown",
                studentId: t.student ? t.student.studentId : "",
                book: t.book ? t.book.title : "Unknown",
                transactionType: t.transactionType,
                status: t.status,
                dueDate: t.dueDate || null,
                createdAt: t.createdAt,
            })),
            roomTransactions: roomTransactions.map((t) => ({
                id: t._id,
                student: t.reservee ? `${t.reservee.firstName} ${t.reservee.lastName}` : "Unknown",
                room: t.room ? `Room ${t.room.number}` : "Unknown",
                reservationDate: t.reservationDate || null,
                startTime: t.startTime || "",
                endTime: t.endTime || "",
                status: t.status,
            })),
        });
    } catch (err) {
        console.error("admin getTransactions error:", err);
        return res.status(500).json({ error: "Failed to load transactions" });
    }
};

// GET /api/admin/log/download?date=YYYY-MM-DD  -> CSV
export const downloadDailyLog = async (req, res) => {
    try {
        const { date } = req.query;
        const start = date ? new Date(date) : new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);

        const [bookTxns, roomTxns, sessions] = await Promise.all([
            BookTransaction.find({ createdAt: { $gte: start, $lte: end } }).populate("book").populate("student"),
            RoomTransaction.find({ createdAt: { $gte: start, $lte: end } }).populate("room").populate("reservee"),
            UserSession.find({ timeIn: { $gte: start, $lte: end } }).sort({ timeIn: 1 }),
        ]);

        const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const rows = [];

        rows.push("TRANSACTIONS");
        rows.push(["Type", "Reference", "User", "ID", "Detail", "Status", "Date"].map(q).join(","));
        bookTxns.forEach((txn) => {
            rows.push([
                txn.transactionType,
                txn.referenceNumber || "",
                txn.student ? `${txn.student.firstName} ${txn.student.lastName}` : "Unknown",
                txn.student ? txn.student.studentId : "",
                txn.book ? txn.book.title : "Unknown",
                txn.status,
                new Date(txn.createdAt).toLocaleString(),
            ].map(q).join(","));
        });
        roomTxns.forEach((txn) => {
            rows.push([
                "room_reservation", "",
                txn.reservee ? `${txn.reservee.firstName} ${txn.reservee.lastName}` : "Unknown",
                txn.reservee ? txn.reservee.studentId : "",
                txn.room ? `Room ${txn.room.number} (${txn.startTime}-${txn.endTime})` : "Unknown",
                txn.status,
                new Date(txn.createdAt).toLocaleString(),
            ].map(q).join(","));
        });

        rows.push("");
        rows.push("SESSION LOG");
        rows.push(["Role", "Name", "ID / Email", "Time In", "Time Out", "Duration"].map(q).join(","));
        sessions.forEach((s) => {
            const timeIn = new Date(s.timeIn);
            const timeOut = s.timeOut ? new Date(s.timeOut) : null;
            const duration = timeOut
                ? (() => { const mins = Math.round((timeOut - timeIn) / 60000); return `${Math.floor(mins / 60)}h ${mins % 60}m`; })()
                : "Active / Not logged out";
            rows.push([
                s.userRole, `${s.firstName} ${s.lastName}`, s.idNumber || s.email,
                timeIn.toLocaleString(), timeOut ? timeOut.toLocaleString() : "—", duration,
            ].map(q).join(","));
        });

        const filename = `daily-log-${start.toISOString().slice(0, 10)}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.send(rows.join("\n"));
    } catch (err) {
        console.error("downloadDailyLog error:", err);
        return res.status(500).json({ error: "Failed to generate daily log" });
    }
};

// GET /api/admin/report/monthly?year=&month=  -> CSV
export const downloadMonthlyReport = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year, 10) || now.getFullYear();
        const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

        const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const end = new Date(year, month, 0, 23, 59, 59, 999);

        const FINE_PER_DAY = 4;
        const FINE_LIMIT = 10;

        const [bookTxns, roomTxns, allStudents, allLibrarians, sessions] = await Promise.all([
            BookTransaction.find({ createdAt: { $gte: start, $lte: end } }).populate("book").populate("student").populate("librarian"),
            RoomTransaction.find({ createdAt: { $gte: start, $lte: end } }).populate("room").populate("reservee").populate("approvedBy"),
            Student.find(),
            Librarian.find(),
            UserSession.find({ timeIn: { $gte: start, $lte: end } }).sort({ userRole: 1, timeIn: 1 }),
        ]);

        const totalBorrowRequests = bookTxns.filter((t) => t.transactionType === "borrow").length;
        const totalApproved = bookTxns.filter((t) => ["approved", "returned", "overdue"].includes(t.status)).length;
        const totalReturned = bookTxns.filter((t) => t.status === "returned").length;
        const overdueTxns = bookTxns.filter((t) => t.status === "overdue");
        const totalOverdue = overdueTxns.length;
        const totalOutstandingFines = overdueTxns.reduce((s, t) => s + (t.fineAmount || 0), 0);
        const totalCancelled = bookTxns.filter((t) => t.status === "cancelled").length;

        const borrowCountMap = {};
        bookTxns.filter((t) => t.transactionType === "borrow" && ["approved", "returned", "overdue"].includes(t.status))
            .forEach((t) => { const title = t.book ? t.book.title : "Unknown"; borrowCountMap[title] = (borrowCountMap[title] || 0) + 1; });
        const top5Borrowed = Object.entries(borrowCountMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

        const top5Liked = await Book.find().sort({ likes: -1 }).limit(5);

        const totalRoomRequests = roomTxns.length;
        const approvedRooms = roomTxns.filter((t) => ["approved", "completed"].includes(t.status));
        const rejectedRooms = roomTxns.filter((t) => t.status === "rejected");
        const cancelledRooms = roomTxns.filter((t) => t.status === "cancelled");
        const roomCountMap = {};
        roomTxns.forEach((t) => { const num = t.room ? `Room ${t.room.number}` : "Unknown"; roomCountMap[num] = (roomCountMap[num] || 0) + 1; });
        const mostReservedRoom = Object.entries(roomCountMap).sort((a, b) => b[1] - a[1])[0];
        const totalAttendees = roomTxns.reduce((s, t) => s + (t.attendeesCount || 0), 0);
        const avgAttendees = roomTxns.length ? (totalAttendees / roomTxns.length).toFixed(2) : 0;

        const newStudents = allStudents.filter((s) => s.createdAt >= start && s.createdAt <= end).length;
        const revokedStudents = allStudents.filter((s) => !s.canBorrow);
        const studentsHitLimit = allStudents.filter((s) => s.fines >= FINE_LIMIT).length;
        const totalFinesAllStudents = allStudents.reduce((s, st) => s + (st.fines || 0), 0);

        const libBorrowApprovals = {}, libRoomApprovals = {}, libReturns = {};
        bookTxns.forEach((t) => {
            if (!t.librarian) return;
            const name = `${t.librarian.firstName} ${t.librarian.lastName}`;
            if (["approved", "returned", "overdue"].includes(t.status)) libBorrowApprovals[name] = (libBorrowApprovals[name] || 0) + 1;
            if (t.transactionType === "return" && t.status === "returned") libReturns[name] = (libReturns[name] || 0) + 1;
        });
        roomTxns.forEach((t) => {
            if (!t.approvedBy) return;
            const name = `${t.approvedBy.firstName} ${t.approvedBy.lastName}`;
            libRoomApprovals[name] = (libRoomApprovals[name] || 0) + 1;
        });

        const totalFineAccumulated = overdueTxns.reduce((s, t) => s + (t.fineAmount || 0), 0);
        const avgFinePerOverdue = totalOverdue ? (totalFineAccumulated / totalOverdue).toFixed(2) : 0;

        const monthName = start.toLocaleString("en-US", { month: "long", year: "numeric" });
        const rows = [];
        const row = (...cols) => rows.push(cols.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
        const sep = () => rows.push("");
        const hdr = (label) => rows.push(`"${label}"`);

        hdr(`Monthly Usage Report — ${monthName}`); sep();
        hdr("BOOK TRANSACTIONS"); row("Metric", "Value");
        row("Total borrow requests submitted", totalBorrowRequests);
        row("Total approved borrows", totalApproved);
        row("Total books returned", totalReturned);
        row("Total overdue transactions", totalOverdue);
        row("Total outstanding fines ($)", totalOutstandingFines.toFixed(2));
        row("Total cancelled transactions", totalCancelled); sep();

        hdr("TOP 5 MOST BORROWED BOOKS"); row("Rank", "Title", "Borrow Count");
        top5Borrowed.forEach(([title, count], i) => row(i + 1, title, count)); sep();

        hdr("TOP 5 MOST LIKED BOOKS"); row("Rank", "Title", "Likes");
        top5Liked.forEach((book, i) => row(i + 1, book.title, book.likes || 0)); sep();

        hdr("ROOM RESERVATIONS"); row("Metric", "Value");
        row("Total reservation requests", totalRoomRequests);
        row("Approved / completed", approvedRooms.length);
        row("Rejected", rejectedRooms.length);
        row("Cancelled", cancelledRooms.length);
        row("Most reserved room", mostReservedRoom ? `${mostReservedRoom[0]} (${mostReservedRoom[1]}x)` : "N/A");
        row("Average attendees per reservation", avgAttendees); sep();

        hdr("STUDENTS"); row("Metric", "Value");
        row("Total registered students", allStudents.length);
        row("New registrations this month", newStudents);
        row("Students with borrowing revoked", revokedStudents.length);
        row("Students who hit $10 fine limit", studentsHitLimit);
        row("Total fines outstanding ($)", totalFinesAllStudents.toFixed(2)); sep();

        hdr("LIBRARIAN ACTIVITY"); row("Librarian", "Borrow Approvals", "Room Approvals", "Returns Processed");
        const allLibNames = new Set([...Object.keys(libBorrowApprovals), ...Object.keys(libRoomApprovals), ...Object.keys(libReturns)]);
        if (allLibNames.size === 0) row("No librarian activity recorded this month", "", "", "");
        else allLibNames.forEach((name) => row(name, libBorrowApprovals[name] || 0, libRoomApprovals[name] || 0, libReturns[name] || 0));
        sep();

        hdr("FINES SUMMARY"); row("Metric", "Value");
        row("Fine rate", `$${FINE_PER_DAY}/day`);
        row("Total fine amount accumulated ($)", totalFineAccumulated.toFixed(2));
        row("Students who reached $10 threshold", studentsHitLimit);
        row("Average fine per overdue transaction ($)", avgFinePerOverdue);

        hdr("SESSION LOG — ALL USERS"); row("Role", "Name", "ID / Email", "Time In", "Time Out", "Duration");
        if (sessions.length === 0) row("No session data recorded this month", "", "", "", "", "");
        else sessions.forEach((s) => {
            const timeIn = new Date(s.timeIn);
            const timeOut = s.timeOut ? new Date(s.timeOut) : null;
            const duration = timeOut
                ? (() => { const mins = Math.round((timeOut - timeIn) / 60000); return `${Math.floor(mins / 60)}h ${mins % 60}m`; })()
                : "Active / Not logged out";
            row(s.userRole, `${s.firstName} ${s.lastName}`, s.idNumber || s.email, timeIn.toLocaleString(), timeOut ? timeOut.toLocaleString() : "—", duration);
        });

        const filename = `monthly-report-${year}-${String(month).padStart(2, "0")}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.send(rows.join("\n"));
    } catch (err) {
        console.error("downloadMonthlyReport error:", err);
        return res.status(500).json({ error: "Failed to generate report" });
    }
};