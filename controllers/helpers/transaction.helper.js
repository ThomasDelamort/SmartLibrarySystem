import BookTransaction from "../../models/bookTransaction.model.js";
import Book from "../../models/book.model.js";
import Student from "../../models/student.model.js";

const generateReference = () => {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const borrowBook = async ({ req, res }) => {
    const { id, dueDate } = req.body;
    const studentId = req.session.user.id;

    const book = await Book.findById(id);

    if (!book) return res.status(404).send("Book not found");

    const redirectWithError = (msg) => {
        res.redirect(`/Students/Book/${encodeURIComponent(book.title)}?error=${encodeURIComponent(msg)}`);
        return;
    };

    const student = await Student.findById(studentId);

    if (!student.canBorrow)
        return redirectWithError("Your borrowing privileges have been revoked due to unpaid fines. Please contact an admin.");

    if (book.status === "borrowed")
        return redirectWithError("This book is already borrowed.");

    if (new Date(dueDate).getTime() <= Date.now())
        return redirectWithError("Invalid due date. Please select a future date.");

    const existing = await BookTransaction.findOne({
        book: id,
        student: studentId,
        status: "pending"
    });

    if (existing)
        return redirectWithError("You already have a pending borrow request for this book.");

    await BookTransaction.create({
        referenceNumber: generateReference(),
        book: id,
        student: studentId,
        librarian: null,
        transactionType: "borrow",
        status: "pending",
        dueDate: new Date(dueDate)
    });

    res.redirect(`/Students/Book/${encodeURIComponent(book.title)}`);
};