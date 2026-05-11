import express from 'express';
import bodyParser from 'body-parser';

import pageRoutes from "./routes/pages.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";

export const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", studentRoutes);