import Student from "../models/student.model.js";
import Librarian from "../models/librarian.model.js";
import Admin from "../models/admin.model.js";

export const dashboard = async (req, res) => {

    const { email, password } = req.body;

    let user = null;
    user = await Student.findOne({ email });


    if (!user) {
        user = await Librarian.findOne({ email });
    }
    if (!user) {
        user = await Admin.findOne({ email });
    }
    if (!user) {
        return res.render("login.ejs", {
            error: "User not found"
        });
    }


    if (user.password !== password) {
        return res.render("login.ejs", {
            error: "Incorrect password"
        });
    }
    req.session.user = {
        id: user._id,
        name: `${user.firstName}`,
        lastName: `${user.lastName}`,
        email: user.email,
        role: user.role,
        sex: user.sex
    };


    if (user.role === "admin") {
        return res.redirect("/Admin");
    }
    if (user.role === "librarian") {


        return res.redirect("/Librarian-Dashboard");
    }
    return res.redirect("/Students");
};

export const logout = async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
}