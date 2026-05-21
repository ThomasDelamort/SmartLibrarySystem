import librarianModel from "../models/librarian.model.js";

export const getLibrarian = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};

export const booksLibrarian = (req, res) => {
    res.render("librarian.books.ejs", { loggedIn: true });
};

export const studentsLists = (req, res) => {
    res.render("librarian.students.ejs", { loggedIn: true });
}

export const transactions = (req, res) => {
    res.render("librarian.transactions.ejs", { loggedIn: true });
}