import student from "../models/student.model.js"

export const dashboard = (req, res) => {
    const email = req.body.eMail;

    const studentReg = /^[a-z0-9._%+-]+@students\.nu-cebu\.edu\.ph$/i;
    const librarianReg = /^[a-z0-9._%+-]+@nu-cebu\.edu\.ph$/i;

    if (!studentReg.test(email) && !librarianReg.test(email)) {
        return res.send("Invalid email address");
    }

    if (studentReg.test(email)) {
        return res.redirect("/Students");
    }

    res.redirect("/Librarian-Dashboard");
};