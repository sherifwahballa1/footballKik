const mongoose = require('mongoose');

const groupchatMessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body:{
        type: String
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const groupMessage = mongoose.model('GroupMessage', groupchatMessageSchema);

module.exports = groupMessage;