import librarianModel from "../models/librarian.model.js";

export const getLibrarian = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};