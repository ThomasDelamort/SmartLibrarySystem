import express from "express";
import books from "../data/books.js";

const router = express.Router();

router.get('/Students', (req, res) => {

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = books.slice(start, end);
    const totalPages = Math.ceil(books.length / booksPerPage);

    res.render('student.ejs', {
        loggedIn: true,
        books: paginatedBooks,
        currentPage: page,
        totalPages
    });
});


router.post('/Submit', (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    const { id, action } = req.body;

    const book = books.find(b => b.id === Number(id));

    if (!book) {
        console.log("BOOK NOT FOUND FOR ID:", id);
        return res.status(404).send("Book not found");
    }

    console.log("FOUND BOOK:", book);

    if (action === "borrow") {
        return res.redirect(`/Students/Book/${book.id}`);
    }
});


router.get('/Students/Book/:id', (req, res) => {

    const { id } = req.params;

    const book = books.find(b => b.id === Number(id));

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: true,
        book
    });
});

export default router;