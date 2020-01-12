const multer = require('multer');
const sharp = require('sharp');
const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');

module.exports.footballNews = async(req, res, next) => {

    res.render('news/footballnews', { title: 'Footballkik - Latest News', user: req.user});
};
