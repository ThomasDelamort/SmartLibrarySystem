import express from 'express';

const router = express.Router();

router.post("/Dashboard", (req, res) => {
    const email = req.body['eMail'];
    const studentReg = /^[a-z0-9._%+-]+@students\.nu-cebu\.edu\.ph$/i;
    const reg = /^[a-z0-9._%+-]+@nu-cebu\.edu\.ph$/i;
    if (!studentReg.test(email.toString()) && !reg.test(email.toString())) {
        return res.send("Invalid email address");
    }
    if (studentReg.test(email.toString())) {
        return res.redirect('/Students');
    } else {
        return res.send("Teaching");
    }
});


export default router;