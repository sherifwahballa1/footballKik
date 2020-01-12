const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderName: {
        type: String
    },
    receiverName: {
        type: String
    },
    userImage: {
        type: String,
        default: 'default.png'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;