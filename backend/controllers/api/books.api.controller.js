import Book from "../../models/book.model.js";
import Student from "../../models/student.model.js";
import { createSearchFilter, createCategoryFilter } from "../helpers/book.helper.js";
import https from "https";

const BOOKS_PER_PAGE = 9;

// Which of these books the current user has liked (empty for guests).
// Mirrors the likedBooks logic the EJS views relied on.
const getLikedBookIds = async (req) => {
    if (!req.session.user) return [];
    const student = await Student.findById(req.session.user.id).select("likedBooks");
    return student ? student.likedBooks.map((id) => id.toString()) : [];
};

// GET /api/books?page=&q=&category=
// Replaces the three EJS routes /Books, /Search, /BookFilter.
// q and category can be combined; category may repeat (?category=a&category=b).
export const listBooks = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const start = (page - 1) * BOOKS_PER_PAGE;

        const q = (req.query.q || "").trim();
        const { category } = req.query;

        const filters = [];
        if (q) filters.push(createSearchFilter(q));
        if (category) filters.push(createCategoryFilter(category));
        const filter = filters.length ? { $and: filters } : {};

        const [books, totalBooks] = await Promise.all([
            Book.find(filter).skip(start).limit(BOOKS_PER_PAGE),
            Book.countDocuments(filter),
        ]);

        const likedBooks = await getLikedBookIds(req);

        return res.json({
            books,
            likedBooks,
            searchQuery: q,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalBooks / BOOKS_PER_PAGE),
                totalBooks,
                booksPerPage: BOOKS_PER_PAGE,
            },
        });
    } catch (err) {
        console.error("listBooks error:", err);
        return res.status(500).json({ error: "Failed to load books" });
    }
};

// GET /api/books/:title  -> { book, likedBooks }
// Replaces GET /Books/Book/:title (single book by title).
export const getBookByTitle = async (req, res) => {
    try {
        const book = await Book.findOne({ title: req.params.title });
        if (!book) return res.status(404).json({ error: "Book not found" });

        const likedBooks = await getLikedBookIds(req);
        return res.json({ book, likedBooks });
    } catch (err) {
        console.error("getBookByTitle error:", err);
        return res.status(500).json({ error: "Failed to load book" });
    }
};

// GET /api/books/:id/pdf
// Streams the book's PDF as a download. Replaces the "downloadPdf" branch of POST /View.
export const downloadBookPdf = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        if (!book.pdfUrl) return res.status(404).json({ error: "No PDF available for this book" });

        const safeTitle = book.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.pdf"`);
        res.setHeader("Content-Type", "application/pdf");

        https.get(book.pdfUrl, (stream) => stream.pipe(res))
            .on("error", () => res.status(500).json({ error: "Failed to download PDF" }));
    } catch (err) {
        console.error("downloadBookPdf error:", err);
        return res.status(500).json({ error: "Failed to download PDF" });
    }
};