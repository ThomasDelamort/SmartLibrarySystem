import {
    paginateBooks,
    createSearchFilter,
    createCategoryFilter,
    handleBookAction,
    renderSingleBook
} from "./helpers/book.helper.js";
import BookTransaction from "../models/bookTransaction.model.js"

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
    const transactions = await BookTransaction.find({
        student: req.session.user.id,
        status: { $in: ["approved", "overdue"] }
    }).populate("book");

    res.render("student.borrowed.ejs", { loggedIn: true, transactions });
};

export const returnBook = async (req, res) => {
    const { transactionId } = req.body;

    const transaction = await BookTransaction.findById(transactionId);

    if (!transaction) return res.status(404).send("Transaction not found");

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