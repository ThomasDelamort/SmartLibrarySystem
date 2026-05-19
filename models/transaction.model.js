import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
    },
})
