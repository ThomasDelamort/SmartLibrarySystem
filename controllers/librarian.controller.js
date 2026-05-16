import librarianModel from "../models/librarian.model.js";

export const librarianDashboard = (req, res) => {
    res.render("librarian.ejs", { loggedIn: true });
};