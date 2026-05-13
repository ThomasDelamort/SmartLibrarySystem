import express from "express";
import books from "../data/books.js";

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

router.get("/Books", (req, res) => {
    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = books.slice(start, end);
    const totalPages = Math.ceil(books.length / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books: paginatedBooks,
        currentPage: page,
        totalPages
    });
});

router.get("/Search", (req, res) => {

    const query = req.query.q?.toLowerCase() || "";

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const filteredBooks = books.filter(book =>

        book.title.toLowerCase().includes(query) ||

        book.author.toLowerCase().includes(query) ||

        book.category.some(cat =>
            cat.toLowerCase().includes(query)
        )
    );

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = filteredBooks.slice(start, end);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books: paginatedBooks,
        currentPage: page,
        totalPages,
        searchQuery: query
    });
});

router.get("/BookFilter", (req, res) => {

    let categ = req.query.category;
    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    let filteredBooks = [...books];


    if (categ) {

        if (!Array.isArray(categ)) {
            categ = [categ];
        }

        filteredBooks = books.filter(book =>
            book.category.some(cat => categ.includes(cat))
        );
    }

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = filteredBooks.slice(start, end);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    res.render("books.ejs", {
        loggedIn: false,
        books: paginatedBooks,
        currentPage: page,
        totalPages
    });
});

router.post("/View", (req, res) => {
    const {title, action} = req.body;

    const book = books.find(b => b.title === title);

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

router.get("/Books/Book/:title", (req, res) => {

    const { title } = req.params;

    const book = books.find(b => b.title === title);

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: false,
        book
    });
});

export default router;