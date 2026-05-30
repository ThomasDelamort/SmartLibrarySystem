import Student from "../models/student.model.js";
import Librarian from "../models/librarian.model.js";
import Admin from "../models/admin.model.js";
import UserSession from "../models/userSession.model.js";

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
        sex: user.sex,
        profilePicture: user.profilePicture || null,
    };

    // Record session time-in
    const session = await UserSession.create({
        userId: user._id,
        userRole: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        idNumber: user.studentId || user.librarianId || user.adminId || "",
        email: user.email,
        timeIn: new Date(),
    });
    // Store session doc id so we can mark time-out on logout
    req.session.sessionDocId = session._id.toString();

    if (user.role === "admin") {
        return res.redirect("/Admin");
    }
    if (user.role === "librarian") {
        return res.redirect("/Librarian-Dashboard");
    }
    return res.redirect("/Students");
};

export const logout = async (req, res) => {
    const sessionDocId = req.session.sessionId;

    if (sessionDocId) {
        try {
            await UserSession.findByIdAndUpdate(sessionDocId, {
                timeout: new Date()
            });
        } catch (err) {
            console.log("Failed to record timeOut:", err);
        }
    }

    req.session.destroy(() => {
       res.redirect("/");
    });
}