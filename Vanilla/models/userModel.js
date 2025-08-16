const {Schema, model} = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is not in valid format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [12, "Password's length must be greater than 8 characters"]
    }
});

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = model('users', UserSchema);