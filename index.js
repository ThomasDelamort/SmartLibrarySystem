import express from "express";
import dotenv from "dotenv";

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


app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", studentRoutes);
app.use("/", librarianRoutes);
app.use("/", adminRoutes);

export default app;