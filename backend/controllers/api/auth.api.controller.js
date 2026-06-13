import Student from "../../models/student.model.js";
import Librarian from "../../models/librarian.model.js";
import Admin from "../../models/admin.model.js";
import UserSession from "../../models/userSession.model.js";
import { verifyPassword, hashPassword, isLegacyPlaintext } from "../helpers/password.helper.js";

// Look the email up across all three account types, same order as the EJS flow.
const findUserByEmail = async (email) => {
    const normalized = String(email).toLowerCase().trim();
    return (
        (await Student.findOne({ email: normalized })) ||
        (await Librarian.findOne({ email: normalized })) ||
        (await Admin.findOne({ email: normalized }))
    );
};

// The session/user shape the SPA receives. Never includes the password.
const publicUser = (user) => ({
    id: user._id,
    name: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    sex: user.sex,
    profilePicture: user.profilePicture || null,
});

// POST /api/login  -> { user } | { error }
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await findUserByEmail(email);
        // Same generic message whether the email or password is wrong (no account enumeration).
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const ok = await verifyPassword(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Transparent upgrade: rehash legacy plaintext passwords on first successful login.
        if (isLegacyPlaintext(user.password)) {
            user.password = await hashPassword(password);
            await user.save();
        }

        req.session.user = publicUser(user);

        // Record session time-in (same as the EJS flow).
        const sessionDoc = await UserSession.create({
            userId: user._id,
            userRole: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            idNumber: user.studentId || user.librarianId || user.adminId || "",
            email: user.email,
            timeIn: new Date(),
        });
        req.session.sessionDocId = sessionDoc._id.toString();

        return res.json({ user: req.session.user });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// GET /api/me  -> { user } | 401 { user: null }
// Lets React restore the logged-in user after a page refresh.
export const me = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ user: null });
    }
    return res.json({ user: req.session.user });
};

// POST /api/logout  -> { success } | { error }
export const logout = async (req, res) => {
    // FIX: login stores `sessionDocId` (the original code read `sessionId`, which was always undefined).
    const sessionDocId = req.session.sessionDocId;

    if (sessionDocId) {
        try {
            // FIX: the UserSession field is `timeOut` (the original code wrote `timeout`).
            await UserSession.findByIdAndUpdate(sessionDocId, { timeOut: new Date() });
        } catch (err) {
            console.error("Failed to record timeOut:", err);
        }
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.clearCookie("connect.sid");
        return res.json({ success: true });
    });
};