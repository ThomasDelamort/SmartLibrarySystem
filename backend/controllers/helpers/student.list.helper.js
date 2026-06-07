import Student from "../../models/student.model.js";

export const paginateStudents = async ({ req, res, view, loggedIn, filter = {}, extra = {} }) => {
    const studentsPerPage = 10;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * studentsPerPage;

    const students = await Student.find(filter).skip(start).limit(studentsPerPage);
    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / studentsPerPage);

    res.render(view, {
        loggedIn,
        students,
        currentPage: page,
        totalPages,
        searchQuery: req.query.q || "",
        ...extra
    });
};

export const createStudentSearchFilter = (query) => {
    return {
        $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { studentId: { $regex: query, $options: "i" } }
        ]
    };
};