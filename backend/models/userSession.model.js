import mongoose from "mongoose";

const userSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        userRole: {
            type: String,
            enum: ["student", "librarian", "admin"],
            required: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        idNumber: {
            // studentId / librarianId / adminId depending on role
            type: String,
            default: "",
        },

        email: {
            type: String,
            default: "",
        },

        timeIn: {
            type: Date,
            required: true,
            default: Date.now,
        },

        timeOut: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const UserSession = mongoose.model("UserSession", userSessionSchema);
export default UserSession;