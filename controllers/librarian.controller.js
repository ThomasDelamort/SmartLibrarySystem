import { paginateBooks, createSearchFilter } from "./helpers/book.helper.js";
import { paginateStudents, createStudentSearchFilter } from "./helpers/student.list.helper.js";
import BookTransaction from "../models/bookTransaction.model.js";
import Book from "../models/book.model.js"
import Student from "../models/student.model.js"
import librarianModel from "../models/librarian.model.js";
import { createNotification } from "./helpers/notification.helper.js";
import Room from "../models/room.model.js";
import RoomTransaction from "../models/roomTransaction.model.js";

export const getLibrarian = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true, searchAction: "/Librarian-Books/Search" });
};


export const booksLibrarian = async (req, res) => {
    await paginateBooks({
        req,
        res,
        filter: createSearchFilter(req.query.q || ""),
        view: "librarian.books.ejs",
        loggedIn: true,
        extra: { searchAction: "/Librarian-Books/Search" }
    });
};

export const studentsLists = async (req, res) => {
    await paginateStudents({
        req,
        res,
        view: "librarian.students.ejs",
        loggedIn: true,
        extra: { searchAction: "/Librarian-SL/Search" }
    });
};

export const searchLibrarianBooks = async (req, res) => {
    const query = req.query.q || "";
    await paginateBooks({
        req,
        res,
        filter: createSearchFilter(query),
        view: "librarian.books.ejs",
        loggedIn: true,
        extra: { searchAction: "/Librarian-Books/Search" }
    });
};

export const searchLibrarianStudents = async (req, res) => {
    const query = req.query.q || "";
    await paginateStudents({
        req,
        res,
        filter: createStudentSearchFilter(query),
        view: "librarian.students.ejs",
        loggedIn: true,
        extra: { searchAction: "/Librarian-SL/Search" }
    });
};



export const transactions = async (req, res) => {
    const [pendingBooks, pendingRooms, borrowed, overdue, returnedToday] = await Promise.all([
        BookTransaction.find({ status: "pending" }).populate("book").populate("student"),
        RoomTransaction.find({ status: "pending" }).populate("room").populate("reservee"),
        BookTransaction.countDocuments({ status: "approved" }),
        BookTransaction.countDocuments({ status: "overdue" }),
        BookTransaction.countDocuments({
            status: "returned",
            transactionType: "return",
            returnDate: { $gte: new Date().setHours(0, 0, 0, 0) }
        })
    ]);

    res.render("librarian.transactions.ejs", {
        loggedIn: true,
        bookTransactions: pendingBooks,
        roomTransactions: pendingRooms,
        stats: { borrowed, overdue, returnedToday },
        searchAction: "/Librarian-Book/Search"
    });
};



// BOOK TRANSACTIONS
export const approveTransaction = async (req, res) => {
    const transaction = await BookTransaction.findById(req.params.id).populate("book");

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "approved";
    transaction.librarian = req.session.user.id;
    await transaction.save();

    await Book.findByIdAndUpdate(transaction.book._id, { status: "borrowed" });

    await Student.findByIdAndUpdate(transaction.student, {
        $push: { borrowedBooks: transaction.book._id }
    });

    await createNotification(
        transaction.student,
        `Your borrow request for "${transaction.book.title}" has been approved`,
        "borrow_approved"
    );

    res.redirect("/Librarian-Transactions");
};


export const rejectTransaction = async (req, res) => {
    const transaction = await BookTransaction.findById(req.params.id).populate("book");

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "cancelled";
    await transaction.save();

    await createNotification(
        transaction.student,
        `Your borrow request for "${transaction.book.title}" has been rejected`,
        "borrow_rejected"
    );

    res.redirect("/Librarian-Transactions");
};


export const confirmReturn = async (req, res) => {
    const returnTransaction = await BookTransaction.findById(req.params.id).populate("book");

    if (!returnTransaction) return res.status(404).send("Transaction not found");

    returnTransaction.status = "returned";
    returnTransaction.returnDate = new Date();
    returnTransaction.librarian = req.session.user.id;
    await returnTransaction.save();

    await BookTransaction.findOneAndUpdate(
        { book: returnTransaction.book._id, student: returnTransaction.student, status: "approved", transactionType: "borrow" },
        { status: "returned", returnDate: new Date() }
    );

    await Book.findByIdAndUpdate(returnTransaction.book._id, { status: "available" });

    await Student.findByIdAndUpdate(returnTransaction.student, {
        $pull: { borrowedBooks: returnTransaction.book._id }
    });

    await createNotification(
        returnTransaction.student,
        `Your return for "${returnTransaction.book.title}" has been confirmed.`,
        "borrow_approved"
    );

    res.redirect("/Librarian-Transactions");
};
// END OF BOOK TRANSACTIONs



// ROOM TRANSACTIONS
export const approveRoomTransaction = async (req, res) => {
    const transaction = await RoomTransaction.findById(req.params.id).populate("room");

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "approved";
    transaction.approvedBy = req.session.user.id;
    await transaction.save();

    await Room.findByIdAndUpdate(transaction.room._id, {
        status: "reserved",
        reservee: transaction.reservee,
        reserveDate: transaction.reservationDate,
        reserveTimeStart: transaction.startTime,
        reserveTimeEnd: transaction.endTime
    });

    await createNotification(
        transaction.reservee,
        `Your reservation for Room ${transaction.room.number} on ${new Date(transaction.reservationDate).toLocaleDateString()} has been approved.`,
        "borrow_approved"
    );

    res.redirect("/Librarian-Transactions");
};

export const rejectRoomTransaction = async (req, res) => {
    const transaction = await RoomTransaction.findById(req.params.id).populate("room");

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "rejected";
    await transaction.save();

    await createNotification(
        transaction.reservee,
        `Your reservation for Room ${transaction.room.number} has been rejected.`,
        "borrow_rejected"
    );

    res.redirect("/Librarian-Transactions");
};


// C R U D
// BOOK CRUD
export const getAddBook = (req, res) => {
    res.render("librarian.book.add.ejs", { loggedIn: true, searchAction: "/Librarian-Books/Search" });
};

export const addBook = async (req, res) => {
    const { title, author, category, image, description, isbn, publisher, publishedYear } = req.body;

    await Book.create({
        title: title.trim(),
        author: author.split(",").map(a => a.trim()),
        category: category.split(",").map(c => c.trim()),
        image: image.trim(),
        description: description.trim(),
        isbn: isbn?.trim(),
        publisher: publisher?.trim(),
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        status: "available"
    });

    res.redirect("/Librarian-Books");
};

export const getEditBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    res.render("librarian.book.edit.ejs", { loggedIn: true, book, searchAction: "/Librarian-Books/Search" });
};

export const editBook = async (req, res) => {
    const { title, author, category, image, description, isbn, publisher, publishedYear, status } = req.body;

    await Book.findByIdAndUpdate(req.params.id, {
        title: title.trim(),
        author: author.split(",").map(a => a.trim()),
        category: category.split(",").map(c => c.trim()),
        image: image.trim(),
        description: description.trim(),
        isbn: isbn?.trim(),
        publisher: publisher?.trim(),
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        status
    });

    res.redirect("/Librarian-Books");
};

export const deleteBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/Librarian-Books");
};