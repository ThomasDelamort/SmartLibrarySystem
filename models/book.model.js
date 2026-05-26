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

    image: {
        type: String,
        required: true
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