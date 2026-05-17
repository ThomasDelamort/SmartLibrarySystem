import librarianModel from "../models/librarian.model.js";

export const librarianDashboard = (req, res) => {
    res.render("librarian-dashboard.ejs", { loggedIn: true });
};

export const librarianBooks = (req, res) => {
    res.render("librarian-books.ejs", { loggedIn: true });
}

export const librarianStudents = (req, res) => {
    res.render("librarian-students.ejs", { loggedIn: true });
}