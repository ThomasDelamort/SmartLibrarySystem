import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs', {loggedIn: false});
});

app.get('/About', (req, res) => {
    res.render('about.ejs', {
        loggedIn: false
    });
});

app.get('/Services', (req, res) => {
    res.render('services.ejs', {loggedIn: false});
});

app.get('/Contact', (req, res) => {
    res.render('contact.ejs', { loggedIn: false});
});


app.get("/Login", (req, res) => {
    res.render('login.ejs');
});


app.post("/Dashboard", (req, res) => {
    const email = req.body['eMail'];
    // const pass = req.body['passWord'];

    const studentReg = /^[a-z0-9._%+-]+@students\.nu-cebu\.edu\.ph$/i;
    const reg = /^[a-z0-9._%+-]+@nu-cebu\.edu\.ph$/i;

    if (!studentReg.test(email.toString()) && !reg.test(email.toString())) {
        return res.send("Invalid email address");
    }

    // console.log("email: " + email);
    // console.log("pass: " + pass);

    if (studentReg.test(email.toString())) {
        return res.redirect('/Students');
    } else {
        return res.send("Teaching");
    }
});

app.get('/Students', (req, res) => {
    res.render("student.ejs", {loggedIn: true});
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});