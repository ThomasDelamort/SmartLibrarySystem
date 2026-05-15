import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
        },

        borrowedBooks: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            }
        ],

        reservations: [
            {
            room: String,
            timeSlot: String,
            data: Date
            }
        ],

        fines: {
            type: Number,
            default: 0,
            min: 0
        },

        role: {
            type: String,
            default: 'student'
        }
    },
{
        timestamps: true
    }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;