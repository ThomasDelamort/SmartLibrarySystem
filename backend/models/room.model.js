import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        number: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        status: {
            type: String,
            enum: [
                "available",
                "reserved",
                "occupied",
                "under-maintenance"
            ],
            default: "available"
        },

        reservee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            default: null
        },

        attendees: {
            type: [String],
            default: []
        },

        reserveDate: {
            type: Date,
            default: null
        },

        reserveTimeStart: {
            type: String,
            default: null
        },

        reserveTimeEnd: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Room", roomSchema);