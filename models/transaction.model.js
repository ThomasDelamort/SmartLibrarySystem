import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        referenceNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        librarian: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Librarian",
            required: true,
        },

        transactionType: {
            type: String,
            enum: ["borrow", "return"],
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "returned", "overdue", "cancelled"],
            default: "pending",
        },

        borrowDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
        },

        returnDate: {
            type: Date,
        },

        fineAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        remarks: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.model("Transaction", TransactionSchema);