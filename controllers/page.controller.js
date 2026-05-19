import {
    paginateBooks,
    createSearchFilter,
    createCategoryFilter,
    handleBookAction,
    renderSingleBook
} from "./helpers/book.helper.js";

export const home = (req, res) => {
    res.render("index.ejs", {loggedIn: false});
};
export const about = (req, res) => {
    res.render("about.ejs", {loggedIn: false});
};
export const services = (req, res) => {
    res.render("services.ejs", {loggedIn: false});
};
export const contact = (req, res) => {
    res.render("contact.ejs", {loggedIn: false});
};
export const login = (req, res) => {
    res.render("login.ejs", {loggedIn: false});
};


export const getBooks = async (req, res) => {
    await paginateBooks({
        req,
        res,
        view: "books.ejs",
        loggedIn: false
    });
};

export const searchBooks = async (req, res) => {
    const query = req.query.q || "";

    await paginateBooks({
        req,
        res,
        filter: createSearchFilter(query),
        view: "books.ejs",
        loggedIn: false
    });
};

export const filterBooks = async (req, res) => {
    await paginateBooks({
        req,
        res,
        filter: createCategoryFilter(req.query.category),
        view: "books.ejs",
        loggedIn: false
    });
};

export const viewBook = async (req, res) => {
    await handleBookAction({
        req,
        res,
        redirectBase: "/Books"
    });
};

export const getBook = async (req, res) => {
    await renderSingleBook({
        req,
        res,
        loggedIn: false
    });
};