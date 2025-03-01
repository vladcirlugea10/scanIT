const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    brand: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    nutriscore: {
        type: String,
        required: false,
    },
}, { _id: false });

module.exports = productSchema;