import mongoose from "mongoose";

const RoomTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },

        reservationDate: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        attendeesCount: {
            type: Number,
            default: 1,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "cancelled",
                "checked-in",
                "completed",
                "no-show",
            ],
            default: "pending",
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Librarian",
            default: null,
        },

        approvedAt: Date,

        rejectionReason: String,

        checkInTime: Date,
        checkOutTime: Date,

        notes: String,

        cancelledAt: Date,

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("RoomTransaction", RoomTransactionSchema);