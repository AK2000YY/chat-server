import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Session = mongoose.model("Session", sessionSchema);

export default Session;