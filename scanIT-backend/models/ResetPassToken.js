const mongoose = require('mongoose');

const resetPassTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('ResetPassToken', resetPassTokenSchema);