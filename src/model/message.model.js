import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        default: ""
    },
    media: {
        type: String,
        default: ""
    },
    messageStatus: {
        type: String,
        enum: ['sent', 'delivere', 'read'],
        default: 'sent'
    },
    isEdited: {
        type: String,
        enum: ['noEdit', 'update', 'delete'],
        default: 'noEdit'
    },
    isShowEdit: {
        type: String,
        enum: ['noOne', 'sender', 'receiver'],
        default: 'noOne'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});


const Message = mongoose.model("Message", messageSchema);

export default Message;