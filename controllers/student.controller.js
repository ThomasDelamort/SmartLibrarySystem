import {
    paginateBooks,
    createSearchFilter,
    createCategoryFilter,
    handleBookAction,
    renderSingleBook
} from "./helpers/book.helper.js";
import BookTransaction from "../models/bookTransaction.model.js"
import Notification from "../models/notification.model.js"


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

