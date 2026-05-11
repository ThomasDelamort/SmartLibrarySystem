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


// router.post('/Submit', (req, res) => {
//
// });

router.get('/Students/Book', (req, res) => {
   const book = books[0];

   res.render("book.ejs", {
      loggedIn: true,
      book
   });
});

export default router;