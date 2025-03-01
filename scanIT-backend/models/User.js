const mongoose = require('mongoose');
const productSchema = require('./Product');

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
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        unique: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    birthday: {
        type: String,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    allergies: [{
        type: String,
        required: false,
    }],
    scannedProducts: {
        type: [productSchema],
        default: [],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    }
    
}, {timestamps: true});

function arrayLimit(val){
    return val.length <= 5;
}

const User = mongoose.model('User', userSchema);

module.exports = User;