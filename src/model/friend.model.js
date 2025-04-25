import mongoose from "mongoose";


const friendSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});


const Friend = mongoose.model("Friend", friendSchema);


export default Friend;