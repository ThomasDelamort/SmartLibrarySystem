import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminId:   {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        required: true,
        default: 'admin',
    },
},
    {
        timestamps: true
    }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;