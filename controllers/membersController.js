const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');
const groupMessage = require('../models/groupchatMessageModel');

module.exports.viewMembers = async(req, res, next) => {
    const allUsers = await User.find({});

    const dataChunk = [];
    const chunkSzie = 4;
    for(let i = 0 ; i< allUsers.length; i+=chunkSzie){
        dataChunk.push(allUsers.slice(i, i+chunkSzie));
    }

    res.render('members', { title: 'Footballkik - Members', user: req.user, chunks: dataChunk });
};

module.exports.searchMembers = async(req, res, next) => {

    const regex = new RegExp(req.body.username, "gi");
    const allUsers = await User.find({ 'username': regex});

    const dataChunk = [];
    const chunkSzie = 4;
    for(let i = 0 ; i< allUsers.length; i+=chunkSzie){
        dataChunk.push(allUsers.slice(i, i+chunkSzie));
    }

    res.render('members', { title: 'Footballkik - Members', user: req.user, chunks: dataChunk });
};