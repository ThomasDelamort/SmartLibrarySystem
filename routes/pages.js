import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index.ejs", {loggedIn: false});
});

router.get('/About', (req, res) => {
    res.render("about.ejs", {loggedIn: false});
});

router.get('/Services', (req, res) => {
    res.render("services.ejs", {loggedIn: false});
});

router.get('/Contact', (req, res) => {
   res.render("contact.ejs", {loggedIn: false});
});

router.get('/Librarian-Dashboard', (req, res) => {
   res.render("librarian.ejs", {loggedIn: true});
});

router.get('/Login', (req, res) => {
   res.render("login.ejs", {loggedIn: true});
});

export default router;