const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,//là một String random để check đăng nhập
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