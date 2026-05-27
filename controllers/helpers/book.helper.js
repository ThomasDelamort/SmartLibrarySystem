import Book from "../../models/book.model.js";
import { borrowBook } from "./transaction.helper.js"

export const paginateBooks = async ({ req, res, filter = {}, view, loggedIn, extra = {} }) => {
    const booksPerPage = 9;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * booksPerPage;

    const books = await Book.find(filter).skip(start).limit(booksPerPage);
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    res.render(view, {
        loggedIn,
        books,
        currentPage: page,
        totalPages,
        searchQuery: req.query.q || "",
        ...extra
    });
};

export const createSearchFilter = (query) => {
    return {
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

            {
                category: {
                    $elemMatch: {
                        $regex: query,
                        $options: "i"
                    }
                }
            }
        ]
    };
};

export const createCategoryFilter = (categories) => {
    if (!categories) return {};

    if (!Array.isArray(categories)) {
        categories = [categories];
    }

    return {
        category: {
            $in: categories
        }
    };
};


export const handleBookAction = async ({ req, res, redirectBase }) => {
    const { id, action } = req.body;
    const book = await Book.findById(id);

    if (!book) return res.status(404).send("Book not found");

    if (book.status === "borrowed") {
        return res.status(404).send("Book already borrowed");
    }

    if (action === "borrow") {
        return await borrowBook({ req, res });
    }

    if (action === "downloadPdf") {
        return res.send(`Downloading PDF for ${book.title}`);
    }
    res.redirect(redirectBase);
};


export const renderSingleBook = async ({ req, res, loggedIn }) => {
    const { title } = req.params;

    const book = await Book.findOne({ title });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
        loggedIn,
        book,
        error: req.query.error || null   // ← add this line
    });
};