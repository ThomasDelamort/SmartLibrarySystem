import express from "express";
import Book from "../models/book.model.js"
// import books from "../data/books.js";

const router = express.Router();


router.get("/Students", async (req, res) => {

    const bpp = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * bpp;

    const books = await Book.find()
        .skip(start)
        .limit(bpp);

    const totalBooks = await Book.countDocuments();

    const totalPages = Math.ceil(totalBooks / bpp);

    res.render("student.ejs", {
        loggedIn: true,
        books,
        currentPage: page,
        totalPages
    });
});



router.get("/Filter", async (req, res) => {

    let categories = req.query.category;

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    if (categories && !Array.isArray(categories)) {
        categories = [categories];
    }

    const filter = categories
        ? { category: { $in: categories } }
        : {};

    const start = (page - 1) * booksPerPage;

    const books = await Book.find(filter)
        .skip(start)
        .limit(booksPerPage);

    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("student.ejs", {
        loggedIn: true,
        books,
        currentPage: page,
        totalPages
    });
});



router.post("/Submit", async (req, res) => {

    console.log("BODY RECEIVED:", req.body);

    const { title, action } = req.body;

    const book = await Book.findOne({ title });

    if (!book) {
        console.log("BOOK NOT FOUND:", title);
        return res.status(404).send("Book not found");
    }

    console.log("FOUND BOOK:", book);

    if (action === "borrow") {
        return res.redirect(`/Students/Book/${book.title}`);
    }

    if (action === "downloadPdf") {
        return res.send(`Downloading PDF for ${book.title}`);
    }

    res.redirect("/Students");
});


router.get("/Search-Book", async (req, res) => {

    const qry = req.query.q || "";

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;

    const filter = {
        $or: [
            { title: { $regex: qry, $options: "i" } },
            { author: { $regex: qry, $options: "i" } },
            { category: { $regex: qry, $options: "i" } }
        ]
    };

    const books = await Book.find(filter)
        .skip(start)
        .limit(booksPerPage);

    const totalBooks = await Book.countDocuments(filter);

    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("student.ejs", {
        loggedIn: true,
        books,
        currentPage: page,
        totalPages,
        searchQuery: qry
    });
});



router.get("/Students/Book/:title", async (req, res) => {

    const { title } = req.params;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: true,
        book
    });
});



router.get("/Search-Book", (req, res) => {

    const qry = req.query.q?.toLowerCase() || "";

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const filteredBooks = books.filter(book =>

        book.title.toLowerCase().includes(qry) ||

        book.author.toLowerCase().includes(qry) ||

        book.category.some(cat =>
            cat.toLowerCase().includes(qry)
        )
    );

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = filteredBooks.slice(start, end);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    res.render("student.ejs", {
        loggedIn: true,
        books: paginatedBooks,
        currentPage: page,
        totalPages,
        searchQuery: qry
    });
});


export default router;