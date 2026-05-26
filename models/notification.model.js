import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["borrow_approved", "borrow_rejected", "due_today", "overdue", "fine"],
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);


export default mongoose.model("Notifications", notificationSchema);