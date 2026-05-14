import Book from "../models/book.model.js";

export const home = (req, res) => {
    res.render("index.ejs", { loggedIn: false });
};

export const about = (req, res) => {
    res.render("about.ejs", { loggedIn: false });
};

export const services = (req, res) => {
    res.render("services.ejs", { loggedIn: false });
};

export const contact = (req, res) => {
    res.render("contact.ejs", { loggedIn: false });
};

export const librarianDashboard = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};

export const login = (req, res) => {
    res.render("login.ejs", { loggedIn: false });
};


// BOOK LOGICS
export const getBooks = async (req, res) => {
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
};

export const searchBooks = async (req, res) => {
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

    res.render("books.ejs", {
        loggedIn: false,
        books,
        currentPage: page,
        totalPages,
        searchQuery: query
    });
};

export const filterBooks = async (req, res) => {
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

    res.render("books.ejs", {
        loggedIn: false,
        books,
        currentPage: page,
        totalPages
    });
};

export const viewBook = async (req, res) => {
    const { title, action } = req.body;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    if (action === "borrow") {
        return res.redirect(`/Books/Book/${book.title}`);
    }

    if (action === "downloadPdf") {
        return res.send(`Downloading PDF for ${book.title}`);
    }

    res.redirect("/Books");
};

export const getBook = async (req, res) => {
    const { title } = req.params;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn: false,
        book
    });
};