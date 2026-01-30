import mongoose from "mongoose";

// Modelo de datos que seguirá MONGOOSE para enviar los datos a MONGODB
const rolesSchema = new mongoose.Schema({
    rolCode: {
        type: Number,
        required: true
    },
    rolName: {
        type: String,
        required: true,
        trim: true
    },
    rolDescription: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

export default mongoose.model('Roles', rolesSchema)
