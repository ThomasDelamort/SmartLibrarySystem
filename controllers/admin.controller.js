export const admin = (req, res) => {
    res.render("admin.ejs", { user: req.session.user });
}