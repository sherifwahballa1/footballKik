const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username : {
        type: String,
        unique: true
    },
    fullname: {
        type: String,
        unique: true,
        default: ''
    },
    email:{
        type: String,
        unique: true
    },
    password: {
        type: String,
        default: ''
    },
    userImage: {
        type: String,
        default: 'default.png'
    },
    facebook: {
        type: String,
        default: ''
    },
    fbToken: Array,
    google: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    twitterToken: Array,
    sentRequest: [{
        username: { type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: { type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: { type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0},
    gender: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    mantra: {
        type: String,
        default: ''
    },
    favNationTeam: [
        { teamName: { type: String, default: ''}}
    ],
    favPlayer: [{
        playerName: { type: String, default: ''}
    }],
    favClub: [
        {
            clubName: { type: String, default: ''}
        }
    ]
});


userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;