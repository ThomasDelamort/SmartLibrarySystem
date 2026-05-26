import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import Notification from "./models/notification.model.js";


import pageRoutes from "./routes/pages.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import librarianRoutes from "./routes/librarian.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
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


app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", studentRoutes);
app.use("/", librarianRoutes);
app.use("/", adminRoutes);

export default app;