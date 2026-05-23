import {
    paginateBooks,
} from "./helpers/book.helper.js";
import librarianModel from "../models/librarian.model.js";

export const getLibrarian = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};


export const booksLibrarian = async (req, res) => {
    await paginateBooks({
        req,
        res,
        view: "librarian.books.ejs",
        loggedIn: true
    });
};

export const studentsLists = (req, res) => {
    res.render("librarian.students.ejs", { loggedIn: true });
}

export const transactions = (req, res) => {
    res.render("librarian.transactions.ejs", { loggedIn: true });
}