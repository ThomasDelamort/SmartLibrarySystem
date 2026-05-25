import Student from "../../models/student.model.js";

export const paginateStudents = async ({ req, res, view, loggedIn }) => {
    const studentsPerPage = 10;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * studentsPerPage;

    const students = await Student.find().skip(start).limit(studentsPerPage);
    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / studentsPerPage);

    res.render(view, {
        loggedIn,
        students,
        currentPage: page,
        totalPages
    });
};