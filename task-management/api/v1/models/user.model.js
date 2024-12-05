const mongoose = require('mongoose');
const generate = require("../../../helpers/generate.js");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(30)
    },//là một String random để check đăng nhập
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
},
{
    timestamps: true
}
);

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;