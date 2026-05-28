import Student from "../models/student.model.js";
import Librarian from "../models/librarian.model.js";
import Book from "../models/book.model.js";
import BookTransaction from "../models/bookTransaction.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";
import Room from "../models/room.model.js";

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
    if (!student) return res.status(404).send("Student not found");
    await Student.findByIdAndUpdate(req.params.id, { canBorrow: !student.canBorrow });
    res.redirect("/Admin/Students");
};

export const deleteStudent = async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/Admin/Students");
};

// LIBRARIANS
export const adminLibrarians = async (req, res) => {
    const librarians = await Librarian.find().sort({ createdAt: -1 });
    res.render("admin.librarians.ejs", { user: req.session.user, librarians });
};

export const addLibrarian = async (req, res) => {
    const { firstName, lastName, email, password, sex } = req.body;
    await Librarian.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        sex,
        role: "librarian"
    });
    res.redirect("/Admin/Librarians");
};

export const deleteLibrarian = async (req, res) => {
    await Librarian.findByIdAndDelete(req.params.id);
    res.redirect("/Admin/Librarians");
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
    res.redirect("/Admin/Books");
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
    res.redirect("/Admin/Rooms");
};

export const deleteRoom = async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    res.redirect("/Admin/Rooms");
};

export const updateRoomStatus = async (req, res) => {
    await Room.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect("/Admin/Rooms");
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

export const downloadDailyLog = async (req, res) => {
    const { date } = req.query;

    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const [bookTxns, roomTxns] = await Promise.all([
        BookTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("book").populate("student"),
        RoomTransaction.find({ createdAt: { $gte: start, $lte: end } })
            .populate("room").populate("reservee")
    ]);

    const rows = [];

    // Header
    rows.push(["Type", "Reference", "Student", "StudentID", "Detail", "Status", "Date"].join(","));

    // Book transactions
    bookTxns.forEach(txn => {
        rows.push([
            txn.transactionType,
            txn.referenceNumber || "",
            txn.student ? `${txn.student.firstName} ${txn.student.lastName}` : "Unknown",
            txn.student ? txn.student.studentId : "",
            txn.book ? txn.book.title : "Unknown",
            txn.status,
            new Date(txn.createdAt).toLocaleString()
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    });

    // Room transactions
    roomTxns.forEach(txn => {
        rows.push([
            "room_reservation",
            "",
            txn.reservee ? `${txn.reservee.firstName} ${txn.reservee.lastName}` : "Unknown",
            txn.reservee ? txn.reservee.studentId : "",
            txn.room ? `Room ${txn.room.number} (${txn.startTime}-${txn.endTime})` : "Unknown",
            txn.status,
            new Date(txn.createdAt).toLocaleString()
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    });

    const filename = `daily-log-${start.toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(rows.join("\n"));
};