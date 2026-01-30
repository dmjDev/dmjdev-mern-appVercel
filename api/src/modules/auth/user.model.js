import mongoose from "mongoose";

// Modelo de datos que seguirá MONGOOSE para enviar los datos a MONGODB
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    userRol: {
        type: Number,
        required: true
    },
    failLogin: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    clientIp: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema)