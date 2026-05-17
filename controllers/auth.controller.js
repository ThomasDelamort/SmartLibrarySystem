import Student from "../models/student.model.js";
import librarian from "../models/librarian.model.js";

export const dashboard = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`email: ${email}`);
        console.log(`password: ${password}`);

        const student = await Student.findOne({ email });

        if (student) {

            if (student.password === password) {
                return res.redirect("/Students");
            } else {
                return res.render("login.ejs", {
                    error: "Incorrect email or password"
                })
            }
        }

        res.render("login.ejs", {
            error: "User not found"
        });

    } catch (error) {
        console.log(`error: ${error}`);

        res.render("login.ejs", {
            error: "Server Error"
        });
    }
};