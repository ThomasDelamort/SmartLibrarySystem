export const librarianAuth = (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).render("401.ejs", {
            error: "Unauthorized Access"
        });
    }

    if (req.session.user.role !== "librarian") {
        return res.status(401).render("401.ejs", {
            error: "Librarian Access Only"
        });
    }

    next();
}


export const adminAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).render("401.ejs", {
            error: "Unauthorized Access"
        });
    }

    if (req.session.user.role !== "admin") {
        return res.status(401).render("401.ejs", {
            error: "Admin Access Only"
        })
    }
}

export const studentAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).redirect("/Login");
    }

    next();
}