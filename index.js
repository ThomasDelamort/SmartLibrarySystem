import express from 'express';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/About', (req, res) => {
    res.render('about.ejs');
});

app.get('/Services', (req, res) => {
    res.render('services.ejs');
});

app.get('/Contact', (req, res) => {
    res.render('contact.ejs');
});

app.get("/Login", (req, res) => {
    res.render('login.ejs');
});

app.get('/Student', (req, res) => {
   res.render('student.ejs');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});