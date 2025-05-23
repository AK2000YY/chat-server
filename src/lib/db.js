import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connecting to ${db.connection.host} is successed...`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB