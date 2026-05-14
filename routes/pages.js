import express from "express";
import Book from "../models/book.model.js";
// import books from "../data/books.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index.ejs", {loggedIn: false});
});

router.get('/About', (req, res) => {
    res.render("about.ejs", {loggedIn: false});
});

router.get('/Services', (req, res) => {
    res.render("services.ejs", {loggedIn: false});
});

router.get('/Contact', (req, res) => {
   res.render("contact.ejs", {loggedIn: false});
});

router.get('/Librarian-Dashboard', (req, res) => {
   res.render("librarian.ejs", {loggedIn: true});
});

router.get('/Login', (req, res) => {
   res.render("login.ejs", {loggedIn: true});
});

router.get("/Books", async (req, res) => {

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;

    const books = await Book.find()
        .skip(start)
        .limit(booksPerPage);

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books,
        currentPage: page,
        totalPages
    });
});

router.get("/Search", async (req, res) => {

    const query = req.query.q || "";

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;

    const filter = {
        $or: [
            { title: { $regex: query, $options: "i" } },
            { author: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
        ]
    }

    const books = await Book.find()
        .skip(start)
        .limit(booksPerPage);

    const totalBooks = await Book.countDocuments(filter)

    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books,
        currentPage: page,
        totalPages,
        searchQuery: query
    });
});



router.get("/BookFilter", async (req, res) => {

    let categ = req.query.category;

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    if (categ && !Array.isArray(categ)) {
        categ = [categ];
    }

    const filter = categ
        ? { category: { $in: categ} }
        : {};

    const start = (page - 1) * booksPerPage;

    const books = await Book.find(filter)
        .skip(start)
        .limit(booksPerPage);


    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books,
        currentPage: page,
        totalPages
    });
});



router.post("/View", async (req, res) => {

    console.log("BODY RECEIVED:", req.body);

    const {title, action} = req.body;

    const book = await Book.findOne({ title });

    if (!book) {
        console.log(`BOOK NOT FOUND ${title}`);
        return res.status(404).send("Book not found");
    }

    console.log("FOUND BOOK:", book);

    if (action === "borrow") {
        return res.redirect(`/Books/Book/${book.title}`);
    }

    if (action === "downloadPdf") {
        return res.send(`Downloading PDF for ${book.title}`);
    }

    res.redirect("/Books");
});



router.get("/Books/Book/:title", async (req, res) => {

    const { title } = req.params;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: false,
        book
    });
});

export default router;