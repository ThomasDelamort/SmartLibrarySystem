import Bag from "../models/bag.model.js";
import Book from "../models/book.model.js";
import BookTransaction from "../models/bookTransaction.model.js";

const generateReference = () => {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};



export const getBag = async (req, res) => {
    const studentId = req.session.user.id;

    const bag = await Bag.findOne({ student: studentId }).populate("items.book");

    res.render("student.bag.ejs", {
        loggedIn: true,
        items: bag ? bag.items : [],
    });
};



export const addToBag = async (req, res) => {
    const { bookId, dueDate } = req.body;
    const studentId = req.session.user.id;

    const book = await Book.findById(bookId);

    if (!book) return res.status(404).send("Book not found");

    const redirectWithError = (msg) => {
        res.redirect(`/Students/Book/${encodeURIComponent(book.title)}?error=${encodeURIComponent(msg)}`);
    };

    if (book.status === "borrowed")
        return redirectWithError("This book is already borrowed.");

    if (!dueDate || new Date(dueDate).getTime() <= Date.now())
        return redirectWithError("Invalid due date. Please select a future date.");


    const existingTransaction = await BookTransaction.findOne({
        book: bookId,
        student: studentId,
        status: "pending",
        transactionType: "borrow",
    });

    if (existingTransaction)
        return redirectWithError("You already have a pending borrow request for this book.");


    let bag = await Bag.findOne({ student: studentId });

    if (!bag) {
        bag = await Bag.create({ student: studentId, items: [] });
    }


    const alreadyInBag = bag.items.some(item => item.book.toString() === bookId);

    if (alreadyInBag)
        return redirectWithError("This book is already in your bag.");

    bag.items.push({ book: bookId, dueDate: new Date(dueDate) });
    await bag.save();

    res.redirect(`/Students/Book/${encodeURIComponent(book.title)}`);
};



export const removeFromBag = async (req, res) => {
    const studentId = req.session.user.id;
    const { bookId } = req.params;

    const bag = await Bag.findOne({ student: studentId });

    if (bag) {
        bag.items = bag.items.filter(item => item.book.toString() !== bookId);
        await bag.save();
    }

    res.redirect("/Students/Bag");
};



export const borrowFromBag = async (req, res) => {
    const studentId = req.session.user.id;

    const bag = await Bag.findOne({ student: studentId }).populate("items.book");

    if (!bag || bag.items.length === 0)
        return res.redirect("/Students/Bag");

    for (const item of bag.items) {
        const book = item.book;


        if (book.status === "borrowed") continue;

        const existing = await BookTransaction.findOne({
            book: book._id,
            student: studentId,
            status: "pending",
            transactionType: "borrow",
        });

        if (existing) continue;

        await BookTransaction.create({
            referenceNumber: generateReference(),
            book: book._id,
            student: studentId,
            librarian: null,
            transactionType: "borrow",
            status: "pending",
            dueDate: item.dueDate,
        });
    }


    bag.items = [];
    await bag.save();

    res.redirect("/Students/Borrowed");
};