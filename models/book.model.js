import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: [String],
        required: true
    },

    category: {
        type: [String],
        required: true
    },

    likes: {
        type: Number,
        default: 0,
        min: 0
    },

    image: {
        type: String,
        required: true
    },

    isbn: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },

    publisher: {
        type: String,
        trim: true
    },

    publishedYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: [
            "available",
            "borrowed",
            "overdue",
            "lost",
            "damaged"
        ],
        default: "available",
    }
}, {
    timestamps: true
});

const Book = mongoose.model("Book", bookSchema);

export default Book;