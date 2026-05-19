import {
    paginateBooks,
    createSearchFilter,
    createCategoryFilter,
    handleBookAction,
    renderSingleBook
} from "./helpers/book.helper.js";

export const getStudents = async (req, res) => {
    await paginateBooks({
        req,
        res,
        view: "student.ejs",
        loggedIn: true
    });
};

export const searchStudentBooks = async (req, res) => {
    const query = req.query.q || "";

    await paginateBooks({
        req,
        res,
        filter: createSearchFilter(query),
        view: "student.ejs",
        loggedIn: true
    });
};

export const filterStudentBooks = async (req, res) => {
    await paginateBooks({
        req,
        res,
        filter: createCategoryFilter(req.query.category),
        view: "student.ejs",
        loggedIn: true
    });
};

export const submitBook = async (req, res) => {
    await handleBookAction({
        req,
        res,
        redirectBase: "/Students"
    });
};

export const getStudentBook = async (req, res) => {
    await renderSingleBook({
        req,
        res,
        loggedIn: true
    });
};