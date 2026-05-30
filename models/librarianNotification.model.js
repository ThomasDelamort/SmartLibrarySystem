import mongoose from "mongoose";

const librarianNotificationSchema = new mongoose.Schema(
    {
        librarian: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Librarian",
            default: null
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "borrow_request",
                "return_request",
                "room_request",
                "overdue"
            ],
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("LibrarianNotification", librarianNotificationSchema);