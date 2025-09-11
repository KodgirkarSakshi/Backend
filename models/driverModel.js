const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const driverSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, "Color must be at least 3 characters long "]
        },
        plate: {
            type: String,
            required: true,
            minlength: [6, "Plate must be at least 6 characters long "],
            unique: true
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1 "]
        },
        vehicleType: {
            type: String,
            enum: ['car', 'bike', 'auto'],
            required: true
        }
    },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
});

// 🔑 Hash password before save
driverSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔑 JWT token
driverSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// 🔑 Compare password
driverSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
module.exports = driver;
