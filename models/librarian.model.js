import mongoose from 'mongoose'

const librarianSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },


    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },
});

const librarian  = mongoose.model('Librarian', librarianSchema);

export default librarian;