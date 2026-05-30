import Student from "../models/student.model.js";
import Librarian from "../models/librarian.model.js";
import Book from "../models/book.model.js";
import BookTransaction from "../models/bookTransaction.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";
import Room from "../models/room.model.js";
import UserSession from "../models/userSession.model.js";

export const admin = async (req, res) => {
    const [
        totalStudents, totalLibrarians, totalBooks,
        recentStudents, recentLibrarians, mostBorrowed,
        processedReservations, cancelledReservations, recentActivity,
        students, librarians, books, mostLiked, rooms,
        bookTransactions, roomTransactions
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
            .populate("book").populate("student")
            .sort({ createdAt: -1 }).limit(3),
        Student.find().sort({ createdAt: -1 }),
        Librarian.find().sort({ createdAt: -1 }),
        Book.find().sort({ createdAt: -1 }),
        Book.find().sort({ likes: -1 }).limit(5),
        Room.find().sort({ number: 1 }),
        BookTransaction.find()
            .populate("book").populate("student")
            .sort({ createdAt: -1 }).limit(50),
        RoomTransaction.find()
            .populate("room").populate("reservee")
            .sort({ createdAt: -1 }).limit(50)
    ]);

    res.render("admin.ejs", {
        user: req.session.user,
        stats: { totalStudents, totalLibrarians, totalBooks },
        recentStudents, recentLibrarians, mostBorrowed,
        reservations: { processed: processedReservations, cancelled: cancelledReservations },
        recentActivity,
        students, librarians, books, mostLiked, rooms,
        bookTransactions, roomTransactions
    });
};


export const adminStudents = async (req, res) => {
    const query = req.query.q || "";
    const filter = query ? {
        $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { studentId: { $regex: query, $options: "i" } }
        ]
    } : {};

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.render("admin.students.ejs", { user: req.session.user, students, searchQuery: query });
};


export const toggleCanBorrow = async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    const updated = await Student.findByIdAndUpdate(
        req.params.id,
        { canBorrow: !student.canBorrow },
        { new: true }
    );
    return res.json({ success: true, canBorrow: updated.canBorrow });
};

// ── Delete student: return JSON so client stays on page ─────────────────────
export const deleteStudent = async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
};

// LIBRARIANS
export const adminLibrarians = async (req, res) => {
    const librarians = await Librarian.find().sort({ createdAt: -1 });
    res.render("admin.librarians.ejs", { user: req.session.user, librarians });
};

export const deleteLibrarian = async (req, res) => {
    await Librarian.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
};

// BOOKS
export const adminBooks = async (req, res) => {
    const query = req.query.q || "";
    const filter = query ? {
        $or: [
            { title: { $regex: query, $options: "i" } },
            { author: { $elemMatch: { $regex: query, $options: "i" } } }
        ]
    } : {};

    const [books, mostBorrowed, mostLiked] = await Promise.all([
        Book.find(filter).sort({ createdAt: -1 }),
        BookTransaction.aggregate([
            { $match: { transactionType: "borrow", status: { $in: ["approved", "returned"] } } },
            { $group: { _id: "$book", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
            { $unwind: "$book" }
        ]),
        Book.find().sort({ likes: -1 }).limit(5)
    ]);

    res.render("admin.books.ejs", { user: req.session.user, books, mostBorrowed, mostLiked, searchQuery: query });
};

export const deleteAdminBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
};

// ROOMS
export const adminRooms = async (req, res) => {
    const rooms = await Room.find().sort({ number: 1 });
    res.render("admin.rooms.ejs", { user: req.session.user, rooms });
};

export const addRoom = async (req, res) => {
    const { number, capacity, description } = req.body;
    await Room.create({
        number: number.trim(),
        capacity: parseInt(capacity),
        description: description?.trim(),
        status: "available"
    });
    res.redirect("/Admin/Rooms");//subject to change
};

export const deleteRoom = async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
};

export const updateRoomStatus = async (req, res) => {
    await Room.findByIdAndUpdate(req.params.id, { status: req.body.status });
    return res.json({ success: true });
};

// TRANSACTIONS
export const adminTransactions = async (req, res) => {
    const [bookTransactions, roomTransactions] = await Promise.all([
        BookTransaction.find()
            .populate("book").populate("student")
            .sort({ createdAt: -1 }).limit(50),
        RoomTransaction.find()
            .populate("room").populate("reservee")
            .sort({ createdAt: -1 }).limit(50)
    ]);

    res.render("admin.transactions.ejs", { user: req.session.user, bookTransactions, roomTransactions });
};

// ── Chart data API: real DB data ─────────────────────────────────────────────
export const chartTrafficData = async (req, res) => {
    const days = parseInt(req.query.days) || 14;
    const now = new Date();
    const labels = [], studentCounts = [], librarianCounts = [];

    for (let i = days - 1; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(now.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const label = dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        labels.push(label);

        const [sCount, lCount] = await Promise.all([
            UserSession.countDocuments({ userRole: "student", timeIn: { $gte: dayStart, $lte: dayEnd } }),
            UserSession.countDocuments({ userRole: "librarian", timeIn: { $gte: dayStart, $lte: dayEnd } }),
        ]);

        studentCounts.push(sCount);
        librarianCounts.push(lCount);
    }

    res.json({ labels, students: studentCounts, librarians: librarianCounts });
};

export const chartReservationData = async (req, res) => {
    const mode = req.query.mode || "weekly"; // 'weekly' | 'monthly'
    const now = new Date();
    const labels = [], processed = [], cancelled = [];

    if (mode === "weekly") {
        // Last 4 weeks
        for (let w = 3; w >= 0; w--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (w + 1) * 7);
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - w * 7);
            weekEnd.setHours(23, 59, 59, 999);

            const weekNum = 4 - w;
            labels.push(`Week ${weekNum}`);

            const [p, c] = await Promise.all([
                RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] }, createdAt: { $gte: weekStart, $lte: weekEnd } }),
                RoomTransaction.countDocuments({ status: "cancelled", createdAt: { $gte: weekStart, $lte: weekEnd } }),
            ]);

            processed.push(p);
            cancelled.push(c);
        }
    } else {
        // Last 4 months
        for (let m = 3; m >= 0; m--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - m, 1, 0, 0, 0, 0);
            const monthEnd   = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59, 999);

            const label = monthStart.toLocaleDateString("en-US", { month: "short" });
            labels.push(label);

            const [p, c] = await Promise.all([
                RoomTransaction.countDocuments({ status: { $in: ["approved", "completed"] }, createdAt: { $gte: monthStart, $lte: monthEnd } }),
                RoomTransaction.countDocuments({ status: "cancelled", createdAt: { $gte: monthStart, $lte: monthEnd } }),
            ]);

            processed.push(p);
            cancelled.push(c);
        }
    }

    res.json({ labels, processed, cancelled });
};

export const downloadDailyLog = async (req, res) => {
    const { date } = req.query;

    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const [bookTxns, roomTxns, sessions] = await Promise.all([
        BookTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("book").populate("student"),
        RoomTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("room").populate("reservee"),
        UserSession.find({ timeIn: { $gte: start, $lte: end } }).sort({ timeIn: 1 }),
    ]);

    const rows = [];
    const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;


    rows.push("TRANSACTIONS");
    rows.push(["Type", "Reference", "User", "ID", "Detail", "Status", "Date"].map(q).join(","));


    bookTxns.forEach(txn => {
        rows.push([
            txn.transactionType,
            txn.referenceNumber || "",
            txn.student ? `${txn.student.firstName} ${txn.student.lastName}` : "Unknown",
            txn.student ? txn.student.studentId : "",
            txn.book ? txn.book.title : "Unknown",
            txn.status,
            new Date(txn.createdAt).toLocaleString()
        ].map(q).join(","));
    });


    roomTxns.forEach(txn => {
        rows.push([
            "room_reservation",
            "",
            txn.reservee ? `${txn.reservee.firstName} ${txn.reservee.lastName}` : "Unknown",
            txn.reservee ? txn.reservee.studentId : "",
            txn.room ? `Room ${txn.room.number} (${txn.startTime}-${txn.endTime})` : "Unknown",
            txn.status,
            new Date(txn.createdAt).toLocaleString()
        ].map(q).join(","));
    });

    rows.push("");


    rows.push("SESSION LOG");
    rows.push(["Role", "Name", "ID / Email", "Time In", "Time Out", "Duration"].map(q).join(","));

    sessions.forEach(s => {
        const timeIn  = new Date(s.timeIn);
        const timeOut = s.timeOut ? new Date(s.timeOut) : null;
        const duration = timeOut
            ? (() => {
                const mins = Math.round((timeOut - timeIn) / 60000);
                return `${Math.floor(mins / 60)}h ${mins % 60}m`;
            })()
            : "Active / Not logged out";

        rows.push([
            s.userRole,
            `${s.firstName} ${s.lastName}`,
            s.idNumber || s.email,
            timeIn.toLocaleString(),
            timeOut ? timeOut.toLocaleString() : "—",
            duration
        ].map(q).join(","));
    });

    const filename = `daily-log-${start.toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(rows.join("\n"));
};

export const downloadMonthlyReport = async (req, res) => {
    const now = new Date();
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const month = parseInt(req.query.month) || (now.getMonth() + 1);

    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end   = new Date(year, month,     0, 23, 59, 59, 999);

    const FINE_PER_DAY = 4;
    const FINE_LIMIT   = 10;

    const [bookTxns, roomTxns, allStudents, allLibrarians, sessions] = await Promise.all([
        BookTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("book").populate("student").populate("librarian"),
        RoomTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("room").populate("reservee").populate("approvedBy"),
        Student.find(),
        Librarian.find(),
        UserSession.find({ timeIn: { $gte: start, $lte: end } }).sort({ userRole: 1, timeIn: 1 }),
    ]);

    // Book Transaction Totals
    const totalBorrowRequests   = bookTxns.filter(t => t.transactionType === "borrow").length;
    const totalApproved         = bookTxns.filter(t => ["approved","returned","overdue"].includes(t.status)).length;
    const totalReturned         = bookTxns.filter(t => t.status === "returned").length;
    const overdueTxns           = bookTxns.filter(t => t.status === "overdue");
    const totalOverdue          = overdueTxns.length;
    const totalOutstandingFines = overdueTxns.reduce((s, t) => s + (t.fineAmount || 0), 0);
    const totalCancelled        = bookTxns.filter(t => t.status === "cancelled").length;

    // Top 5 most borrowed
    const borrowCountMap = {};
    bookTxns.filter(t => t.transactionType === "borrow" && ["approved","returned","overdue"].includes(t.status))
        .forEach(t => {
            const title = t.book ? t.book.title : "Unknown";
            borrowCountMap[title] = (borrowCountMap[title] || 0) + 1;
        });
    const top5Borrowed = Object.entries(borrowCountMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Top 5 most liked
    const top5Liked = await Book.find().sort({ likes: -1 }).limit(5);

    // Room Totals
    const totalRoomRequests = roomTxns.length;
    const approvedRooms     = roomTxns.filter(t => ["approved","completed"].includes(t.status));
    const rejectedRooms     = roomTxns.filter(t => t.status === "rejected");
    const cancelledRooms    = roomTxns.filter(t => t.status === "cancelled");

    const roomCountMap = {};
    roomTxns.forEach(t => {
        const num = t.room ? `Room ${t.room.number}` : "Unknown";
        roomCountMap[num] = (roomCountMap[num] || 0) + 1;
    });
    const mostReservedRoom = Object.entries(roomCountMap).sort((a, b) => b[1] - a[1])[0];
    const totalAttendees   = roomTxns.reduce((s, t) => s + (t.attendeesCount || 0), 0);
    const avgAttendees     = roomTxns.length ? (totalAttendees / roomTxns.length).toFixed(2) : 0;

    // Student Stats
    const newStudents           = allStudents.filter(s => s.createdAt >= start && s.createdAt <= end).length;
    const revokedStudents       = allStudents.filter(s => !s.canBorrow);
    const studentsHitLimit      = allStudents.filter(s => s.fines >= FINE_LIMIT).length;
    const totalFinesAllStudents = allStudents.reduce((s, st) => s + (st.fines || 0), 0);

    // Librarian Activity
    const libBorrowApprovals = {}, libRoomApprovals = {}, libReturns = {};
    bookTxns.forEach(t => {
        if (!t.librarian) return;
        const name = `${t.librarian.firstName} ${t.librarian.lastName}`;
        if (["approved","returned","overdue"].includes(t.status))
            libBorrowApprovals[name] = (libBorrowApprovals[name] || 0) + 1;
        if (t.transactionType === "return" && t.status === "returned")
            libReturns[name] = (libReturns[name] || 0) + 1;
    });
    roomTxns.forEach(t => {
        if (!t.approvedBy) return;
        const name = `${t.approvedBy.firstName} ${t.approvedBy.lastName}`;
        libRoomApprovals[name] = (libRoomApprovals[name] || 0) + 1;
    });

    // Fine Summary
    const totalFineAccumulated = overdueTxns.reduce((s, t) => s + (t.fineAmount || 0), 0);
    const avgFinePerOverdue    = totalOverdue ? (totalFineAccumulated / totalOverdue).toFixed(2) : 0;

    // Build CSV
    const monthName = start.toLocaleString("en-US", { month: "long", year: "numeric" });
    const rows = [];
    const row = (...cols) => rows.push(cols.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const sep = () => rows.push("");
    const hdr = label => rows.push(`"${label}"`);

    hdr(`Monthly Usage Report — ${monthName}`);  sep();

    hdr("BOOK TRANSACTIONS");
    row("Metric", "Value");
    row("Total borrow requests submitted",  totalBorrowRequests);
    row("Total approved borrows",           totalApproved);
    row("Total books returned",             totalReturned);
    row("Total overdue transactions",       totalOverdue);
    row("Total outstanding fines ($)",      totalOutstandingFines.toFixed(2));
    row("Total cancelled transactions",     totalCancelled);  sep();

    hdr("TOP 5 MOST BORROWED BOOKS");
    row("Rank", "Title", "Borrow Count");
    top5Borrowed.forEach(([title, count], i) => row(i + 1, title, count));  sep();

    hdr("TOP 5 MOST LIKED BOOKS");
    row("Rank", "Title", "Likes");
    top5Liked.forEach((book, i) => row(i + 1, book.title, book.likes || 0));  sep();

    hdr("ROOM RESERVATIONS");
    row("Metric", "Value");
    row("Total reservation requests",        totalRoomRequests);
    row("Approved / completed",              approvedRooms.length);
    row("Rejected",                          rejectedRooms.length);
    row("Cancelled",                         cancelledRooms.length);
    row("Most reserved room",                mostReservedRoom ? `${mostReservedRoom[0]} (${mostReservedRoom[1]}x)` : "N/A");
    row("Average attendees per reservation", avgAttendees);  sep();

    hdr("STUDENTS");
    row("Metric", "Value");
    row("Total registered students",         allStudents.length);
    row("New registrations this month",      newStudents);
    row("Students with borrowing revoked",   revokedStudents.length);
    row("Students who hit $10 fine limit",   studentsHitLimit);
    row("Total fines outstanding ($)",       totalFinesAllStudents.toFixed(2));  sep();

    hdr("LIBRARIAN ACTIVITY");
    row("Librarian", "Borrow Approvals", "Room Approvals", "Returns Processed");
    const allLibNames = new Set([...Object.keys(libBorrowApprovals), ...Object.keys(libRoomApprovals), ...Object.keys(libReturns)]);
    if (allLibNames.size === 0) {
        row("No librarian activity recorded this month", "", "", "");
    } else {
        allLibNames.forEach(name => row(name, libBorrowApprovals[name] || 0, libRoomApprovals[name] || 0, libReturns[name] || 0));
    }
    sep();

    hdr("FINES SUMMARY");
    row("Metric", "Value");
    row("Fine rate",                              `$${FINE_PER_DAY}/day`);
    row("Total fine amount accumulated ($)",      totalFineAccumulated.toFixed(2));
    row("Students who reached $10 threshold",     studentsHitLimit);
    row("Average fine per overdue transaction ($)", avgFinePerOverdue);

    // ── Session log ──────────────────────────────────────────────────────────
    hdr("SESSION LOG — ALL USERS");
    row("Role", "Name", "ID / Email", "Time In", "Time Out", "Duration");

    if (sessions.length === 0) {
        row("No session data recorded this month", "", "", "", "", "");
    } else {
        sessions.forEach(s => {
            const timeIn  = new Date(s.timeIn);
            const timeOut = s.timeOut ? new Date(s.timeOut) : null;
            const duration = timeOut
                ? (() => {
                    const mins = Math.round((timeOut - timeIn) / 60000);
                    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
                })()
                : "Active / Not logged out";

            row(
                s.userRole,
                `${s.firstName} ${s.lastName}`,
                s.idNumber || s.email,
                timeIn.toLocaleString(),
                timeOut ? timeOut.toLocaleString() : "—",
                duration
            );
        });
    }

    const filename = `monthly-report-${year}-${String(month).padStart(2, "0")}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(rows.join("\n"));
};