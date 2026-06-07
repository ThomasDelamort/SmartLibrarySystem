import mongoose from "mongoose";

const bagSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            unique: true,
        },

        items: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                dueDate: {
                    type: Date,
                    required: true,
                },
            }
        ],
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Bag", bagSchema);