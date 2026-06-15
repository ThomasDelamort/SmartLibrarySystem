import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import Notification from "./models/notification.model.js";
import LibrarianNotification from "./models/librarianNotification.model.js";

import pageRoutes from "./routes/pages.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import librarianRoutes from "./routes/librarian.js";
import adminRoutes from "./routes/admin.js";

// --- API (React/JSON) routes ---
import authApiRoutes from "./routes/api/auth.api.js";
import booksApiRoutes from "./routes/api/books.api.js";
import studentsApiRoutes from "./routes/api/students.api.js";
import librarianApiRoutes from "./routes/api/librarian.api.js";

dotenv.config();

const app = express();

const isProd = process.env.NODE_ENV === "production";

// Needed so secure cookies work when running behind a proxy (e.g. in production).
app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- CORS for the React client ---
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use(async (req, res, next) => {
    if (req.session.user) {
        const notifications = await Notification.find({
            student: req.session.user.id,
            isRead: false
        }).sort({ createdAt: -1 }).limit(10);

        res.locals.notifications = notifications;
        res.locals.unreadCount = notifications.length;
    } else {
        res.locals.notifications = [];
        res.locals.unreadCount = 0;
    }

    next();
});

app.use(async (req, res, next) => {
    if (req.session.user && req.session.user.role === "librarian") {
        const librarianNotifications = await LibrarianNotification.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(10);

        res.locals.librarianNotifications = librarianNotifications;
        res.locals.librarianUnreadCount = librarianNotifications.length;
    } else {
        res.locals.librarianNotifications = [];
        res.locals.librarianUnreadCount = 0;
    }
    next();
});

// --- JSON API routes (consumed by React) ---
app.use("/api", authApiRoutes);
app.use("/api", booksApiRoutes);
app.use("/api", studentsApiRoutes);
app.use("/api", librarianApiRoutes);

// --- Existing EJS routes (unchanged, served in parallel during migration) ---
app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", studentRoutes);
app.use("/", librarianRoutes);
app.use("/", adminRoutes);

export default app;