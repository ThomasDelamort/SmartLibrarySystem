import Book from "../models/book.model.js";

export const getStudents = async (req, res) => {
    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;

    const books = await Book.find()
        .skip(start)
        .limit(booksPerPage);

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render("student.ejs", {
        loggedIn: true,
        books,
        currentPage: page,
        totalPages
    });
};

export const filterStudentBooks = async (req, res) => {
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
};

export const searchStudentBooks = async (req, res) => {
    const query = req.query.q || "";

    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    const start = (page - 1) * booksPerPage;

    const filter = {
        $or: [
            { title: { $regex: query, $options: "i" } },

            {
                author: {
                    $elemMatch: {
                        $regex: query,
                        $options: "i"
                    }
                }
            },

            { category: { $regex: query, $options: "i" } }
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
        searchQuery: query
    });
};

export const submitBook = async (req, res) => {
    const { title, action } = req.body;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    if (action === "borrow") {
        return res.redirect(`/Students/Book/${book.title}`);
    }

    if (action === "downloadPdf") {
        return res.send(`Downloading PDF for ${book.title}`);
    }

    res.redirect("/Students");
};

export const getStudentBook = async (req, res) => {
    const { title } = req.params;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: true,
        book
    });
};