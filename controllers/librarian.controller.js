import { paginateBooks } from "./helpers/book.helper.js";
import { paginateStudents } from "./helpers/student.list.helper.js";
import BookTransaction from "../models/bookTransaction.model.js";
import Book from "../models/book.model.js"
import Student from "../models/student.model.js"
import librarianModel from "../models/librarian.model.js";

export const getLibrarian = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};

export const booksLibrarian = async (req, res) => {
    await paginateBooks({
        req,
        res,
        view: "librarian.books.ejs",
        loggedIn: true
    });
};

export const studentsLists = async (req, res) => {
    await paginateStudents({
        req,
        res,
        view: "librarian.students.ejs",
        loggedIn: true
    });
};

export const transactions = async (req, res) => {
    const [pending, borrowed, overdue, returnedToday] = await Promise.all([
        BookTransaction.find({ status: "pending" }).populate("book").populate("student"),
        BookTransaction.countDocuments({ status: "approved" }),
        BookTransaction.countDocuments({ status: "overdue" }),
        BookTransaction.countDocuments({
            status: "returned",
            returnDate: { $gte: new Date().setHours(0, 0, 0, 0) }
        })
    ]);

    res.render("librarian.transactions.ejs", {
        loggedIn: true,
        transactions: pending,
        stats: { borrowed, overdue, returnedToday }
    });
};

export const approveTransaction = async (req, res) => {
    const transaction = await BookTransaction.findById(req.params.id);

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "approved";
    transaction.librarian = req.session.user.id;
    await transaction.save();

    await Book.findByIdAndUpdate(transaction.book, { status: "borrowed" });

    await Student.findByIdAndUpdate(transaction.student, {
        $push: { borrowedBooks: transaction.book }
    });

    res.redirect("/Librarian-Transactions");
};


export const rejectTransaction = async (req, res) => {
    const transaction = await BookTransaction.findById(req.params.id);

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "cancelled";
    await transaction.save();

    res.redirect("/Librarian-Transactions");
};

export const confirmReturn = async (req, res) => {
    const transaction = await BookTransaction.findById(req.params.id);

    if (!transaction) return res.status(404).send("Transaction not found");

    transaction.status = "returned";
    transaction.returnDate = new Date();
    await transaction.save();

    await Book.findByIdAndUpdate(transaction.book, { status: "available" });

    await Student.findByIdAndUpdate(transaction.student, {
        $pull: { borrowedBooks: transaction.book }
    });

    res.redirect("/Librarian-Transactions");
};