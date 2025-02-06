const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lasName: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: false,
    },
    birthday: {
        type: String,
        required: false,
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;