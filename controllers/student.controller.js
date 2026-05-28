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
import Book from "../models/book.model.js"



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

    const referer = req.headers.referer;
    const redirectTo = referer ? new URL(referer).pathname: "/Students";
    res.redirect(redirectTo);
};



export const getRooms = async (req, res) => {
    const rooms = await Room.find();
    res.render("student.rooms.ejs", { loggedIn: true, rooms });
};



export const reserveRoom = async (req, res) => {
    const { roomId, reservationDate, startTime, endTime, purpose, attendeesCount } = req.body;

    const room = await Room.findById(roomId);

    if (!room) return res.status(404).send('Room not found');

    if (room.status !== "available") return res.redirect("/Students/Rooms");

    const conflict = await RoomTransaction.findOne({
        room: roomId,
        reservationDate: new Date(reservationDate),
        status: { $in: ["pending", "approved"] },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime }}
        ]
    });

    if (conflict) return res.redirect("/Students/Rooms");

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


// Like Function

export const toggleLike = async (req, res) => {
    const studentId = req.session.user.id;
    const { bookId } = req.params;

    const student = await Student.findById(studentId);
    const alreadyLiked = student.likedBooks.some(id => id.toString() === bookId);

    if (alreadyLiked) {
        await Student.findByIdAndUpdate(studentId, { $pull: { likedBooks: bookId } });
        await Book.findByIdAndUpdate(bookId, { $inc: { likes: -1 } });
    } else {
        await Student.findByIdAndUpdate(studentId, { $push: { likedBooks: bookId } });
        await Book.findByIdAndUpdate(bookId, { $inc: { likes: 1 } });
    }

    const referer = req.headers.referer || "/Students";
    res.redirect(referer);
};

export const getLikedBooks = async (req, res) => {
    const student = await Student.findById(req.session.user.id).populate("likedBooks");
    res.render("student.liked.ejs", { loggedIn: true, likedBooks: student.likedBooks });
};


// Student Profile

export const getStudentProfile = async (req, res) => {
    const student = await Student.findById(req.session.user.id);
    res.render("student.profile.ejs", {
        loggedIn: true,
        student,
        error: req.query.error || null,
        success: req.query.success || null,
    });
};

export const updateStudentProfile = async (req, res) => {
    const { firstName, lastName, email, sex } = req.body;

    const emailTaken = await Student.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.session.user.id }
    });

    if (emailTaken)
        return res.redirect("/Students/Profile?error=Email+is+already+in+use");

    await Student.findByIdAndUpdate(req.session.user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        sex,
    });

    // Update session name
    req.session.user.name = firstName.trim();
    req.session.user.lastName = lastName.trim();

    res.redirect("/Students/Profile?success=Profile+updated+successfully");
};

export const changeStudentPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const student = await Student.findById(req.session.user.id);

    if (student.password !== currentPassword)
        return res.redirect("/Students/Profile?error=Current+password+is+incorrect");

    if (newPassword !== confirmPassword)
        return res.redirect("/Students/Profile?error=New+passwords+do+not+match");

    if (newPassword.length < 6)
        return res.redirect("/Students/Profile?error=Password+must+be+at+least+6+characters");

    await Student.findByIdAndUpdate(req.session.user.id, { password: newPassword });

    res.redirect("/Students/Profile?success=Password+changed+successfully");
};


export const uploadStudentProfilePicture = async (req, res) => {
    if (!req.file)
        return res.redirect("/Students/Profile?error=No+file+uploaded");

    await Student.findByIdAndUpdate(req.session.user.id, {
        profilePicture: req.file.location,
    });

    req.session.user.profilePicture = req.file.location;

    res.redirect("/Students/Profile?success=Profile+picture+updated");
};

