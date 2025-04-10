const mongoose = require('mongoose');
const productSchema = require('./Product');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
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
    },
    addedProductsBarcodes: [{
        type: String,
        required: false,
    }],
    editedProductsBarcodes: [{
        type: String,
        required: false,
    }]
    
}, {timestamps: true});

function arrayLimit(val){
    return val.length <= 5;
}

const User = mongoose.model('User', userSchema);

module.exports = User;