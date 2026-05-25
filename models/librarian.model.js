import mongoose from 'mongoose'

const librarianSchema = new mongoose.Schema({
    librarianId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

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

    sex: {
        type: String,
        enum: [
            "male",
            "female",
        ]
    },

    married: {
        type: Boolean,
        default: false
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

    role: {
        type: String,
        default: 'librarian',
    }
},
    {
        timestamps: true
    }
);

const librarian  = mongoose.model('Librarian', librarianSchema);

export default librarian;