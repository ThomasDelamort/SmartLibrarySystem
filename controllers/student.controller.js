import {
    paginateBooks,
    createSearchFilter,
    createCategoryFilter,
    handleBookAction,
    renderSingleBook
} from "./helpers/book.helper.js";
import BookTransaction from "../models/bookTransaction.model.js"
import Notification from "../models/notification.model.js"
import Room from "../models/room.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";
import Student from "../models/student.model.js"


export const getStudents = async (req, res) => {
    await paginateBooks({
        req,
        res,
        view: "student.ejs",
        loggedIn: true
    });
};


export const searchStudentBooks = async (req, res) => {
    const query = req.query.q || "";

    await paginateBooks({
        req,
        res,
        filter: createSearchFilter(query),
        view: "student.ejs",
        loggedIn: true
    });
};


export const filterStudentBooks = async (req, res) => {
    await paginateBooks({
        req,
        res,
        filter: createCategoryFilter(req.query.category),
        view: "student.ejs",
        loggedIn: true
    });
};


export const submitBook = async (req, res) => {
    await handleBookAction({
        req,
        res,
        redirectBase: "/Students"
    });
};


export const getStudentBook = async (req, res) => {
    await renderSingleBook({
        req,
        res,
        loggedIn: true,
    });
};


export const getBorrowedBooks = async (req, res) => {
    const studentId = req.session.user.id;

    const pendingReturns = await BookTransaction.find({
        student: studentId,
        transactionType: "return",
        status: "pending"
    }).distinct("book");

    const transactions = await BookTransaction.find({
        student: studentId,
        status: { $in: ["approved", "overdue"] }
    }).populate("book");


    const transactionsWithStatus = transactions.map(txn => ({
        ...txn.toObject(),
        pendingReturn: pendingReturns.some(id => id.equals(txn.book._id))
    }));

    res.render("student.borrowed.ejs", { loggedIn: true, transactions: transactionsWithStatus });
};


export const returnBook = async (req, res) => {
    const { transactionId } = req.body;

    const transaction = await BookTransaction.findById(transactionId);

    if (!transaction) return res.status(404).send("Transaction not found");

    const existingReturn = await BookTransaction.findOne({
        book: transaction.book,
        student: req.session.user.id,
        transactionType: "return",
        status: "pending"
    });

    if (existingReturn) return res.redirect("/Students/Borrowed");

    await BookTransaction.create({
        referenceNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        book: transaction.book,
        student: req.session.user.id,
        transactionType: "return",
        status: "pending",
        dueDate: transaction.dueDate
    });

    res.redirect("/Students/Borrowed");
};




export const markNotificationRead = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.redirect("/Students");
}



export const getRooms = async (req, res) => {
    const rooms = await Room.find();
    res.render("student.rooms.ejs", { loggedIn: true, rooms });
};



export const reserveRoom = async (req, res) => {
    const { roomId, reservationDate, startTime, endTime, purpose, attendeesCount } = req.body;

    const room = await Room.findById(roomId);

    if (!room) return res.status(404).send('Room not found');

    if (room.status !== "available") return res.redirect("/Students/Room");

    const conflict = await RoomTransaction.findOne({
        room: roomId,
        reservationDate: new Date(reservationDate),
        status: { $in: ["pending", "approved"] },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime }}
        ]
    });

    if (conflict) return res.redirect("/Students/Room");

    await RoomTransaction.create({
        reservee: req.session.user.id,
        room: roomId,
        reservationDate: new Date(reservationDate),
        startTime,
        endTime,
        purpose,
        attendeesCount: parseInt(attendeesCount)
    });

    res.redirect("/Students/Rooms");
}



// Room Reservations
export const getReservations = async (req, res) => {
    const reservations = await RoomTransaction.find({
        reservee: req.session.user.id,
        status: { $in: ["pending", "approved"] }
    }).populate("room");

    res.render("student.rr.ejs", { loggedIn: true, reservations });
};

export const cancelReservation = async (req, res) => {
    const reservation = await RoomTransaction.findById(req.params.id);

    if (!reservation) return res.status(404).send("Reservation not found");

    const wasApproved = reservation.status === "approved";

    reservation.status = "cancelled";
    await reservation.save();

    if (wasApproved) {
        await Room.findByIdAndUpdate(reservation.room, {
            status: "available",
            reservee: null,
            reserveDate: null,
            reserveTimeStart: null,
            reserveTimeEnd: null
        });
    }

    res.redirect("/Students/Reservations");
};


export const getStatus = async (req, res) => {
    const student = await Student.findById(req.session.user.id);

    const overdueBooks = await BookTransaction.find({
        student: req.session.user.id,
        status: "overdue"
    }).populate("book");

    res.render("student.status.ejs", { loggedIn: true, student, overdueBooks });
};


export const getHistory = async (req, res) => {
    const studentId = req.session.user.id;

    const [bookHistory, roomHistory] = await Promise.all([
        BookTransaction.find({
            student: studentId,
            transactionType: "borrow",
            status: { $in: ["returned", "cancelled"] }
        }).populate("book").sort({ createdAt: -1 }),

        RoomTransaction.find({
            reservee: studentId,
            status: { $in: ["completed", "cancelled", "rejected"] }
        }).populate("room").sort({ createdAt: -1 })
    ]);

    res.render("student.history.ejs", { loggedIn: true, bookHistory, roomHistory });
};