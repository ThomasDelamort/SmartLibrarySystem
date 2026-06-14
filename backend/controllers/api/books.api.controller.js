import Book from "../../models/book.model.js";
import Student from "../../models/student.model.js";
import { createSearchFilter, createCategoryFilter } from "../helpers/book.helper.js";
import https from "https";

const BOOKS_PER_PAGE = 9;


const getLikedBookIds = async (req) => {
    if (!req.session.user) return [];
    const student = await Student.findById(req.session.user.id).select("likedBooks");
    return student ? student.likedBooks.map((id) => id.toString()) : [];
};


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


export const getBookByTitle = async (req, res) => {
    try {
        const book = await Book.findOne({ title: req.params.title });
        if (!book) return res.status(404).json({ error: "Book not found" });

        // Safety net: never expose a negative like count.
        const bookObj = book.toObject();
        bookObj.likes = Math.max(0, bookObj.likes ?? 0);

        const likedBooks = await getLikedBookIds(req);
        return res.json({ book: bookObj, likedBooks });
    } catch (err) {
        console.error("getBookByTitle error:", err);
        return res.status(500).json({ error: "Failed to load book" });
    }
};


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