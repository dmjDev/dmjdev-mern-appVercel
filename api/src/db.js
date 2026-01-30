import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI_ATLAS)
        console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
