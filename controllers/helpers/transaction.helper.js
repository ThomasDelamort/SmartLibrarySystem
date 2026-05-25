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

    if (book.status === "borrowed") {
        return res.status(400).send("Book is already borrowed");
    }

    const existing = await BookTransaction.findOne({
        book: id,
        student: studentId,
        status: "pending"
    });

    if (existing) {
        return res.status(400).send("You already have a pending request for this book");
    }

    await BookTransaction.create({
        referenceNumber: generateReference(),
        book: id,
        student: studentId,
        librarian: null,
        transactionType: "borrow",
        status: "pending",
        dueDate: new Date(dueDate)
    });

    res.redirect(`/Students/Book/${book.title}`);
};