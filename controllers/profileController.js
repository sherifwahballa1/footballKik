const _  = require('lodash');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');
const groupMessage = require('../models/groupchatMessageModel');

const multerStroage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const err = new Error('Not an image! please upload only images.');
    err.statusCode = 400;
    err.status = 'fail';
    cb(err, false);
  }
};

const upload = multer({
  storage: multerStroage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('upload');

exports.resizeUserPhoto =  async(req, res, next) => {
  try{
  if (!req.file) return next();

  req.file.filename = `${req.file.originalname}`;
   await sharp(req.file.buffer)
    .resize(300, 300)
    .toFile(`public/profileUploads/${req.file.filename}`);
  }catch(err) {
    console.log(err);
  }

  next();
};

module.exports.getProfilePage = async(req, res, next) => {
    const name = req.params.name;
    const userData = await User.findOne({ 'username': req.user.username }).populate('request.userId');
    
    const messages = await Message.aggregate(
        [{ $match: { $or: [
            {'senderName': req.user.username },
            {'receiverName': req.user.username}] }},
            { $sort: {'createdAt': -1 }},
            {
                $group: {
                    "_id":{
                        "last_message_between":{
                            $cond: [
                                {
                                    $gt: [
                                        {$substr: ["$senderName", 0, 1]},
                                        {$substr: ["$receiverName", 0, 1]}
                                    ]
                                },
                                  { $concat: ["$senderName", " and ", "$receiverName"]},
                                  { $concat: ["$receiverName", " and ", "$senderName"]}
                            ]
                        }
                    }, "body": {$first:"$$ROOT"}
                }
            }]
        );

    res.render('user/profile', { title: 'Footballkik - Profile', user: req.user, groupName: name, dat: userData, chat:messages });
};

module.exports.postProfilePage = async(req, res, next) => {

    try{
        if(req.body.receiver){
            await User.update(
                {
                'username': req.body.receiver,
                'request.userId': { $ne: req.user._id},
                'friendsList.friendId': {$ne: req.user._id}
                },
                {
                    $push: { request: {
                        userId: req.user._id,
                        username: req.user.username
                    }},
                    $inc: {totalRequest: 1}
                });

            await User.update({
                    'username': req.user.username,
                    'sentRequest.username': {$ne: req.body.receiver}
                },
                {
                    $push: {
                        sentRequest: {
                            username: req.body.receiver
                        }
                    }
                });

                res.redirect('/settings/profile');
        }
        if(req.body.senderId){
            await User.update({
                '_id': req.user._id,
                'friendsList.friendId': {$ne: req.body.senderId}
            },{
                $push: {friendsList: {
                    friendId: req.body.senderId,
                    friendName: req.body.senderName
                }},
                $pull: { request: {
                    userId: req.body.senderId,
                    username: req.body.senderName
                }},
                $inc: { totalRequest: -1 }
            }, (err) => {
                if(err){ 
                    console.log(err);
                }
            });

            await User.update({
                '_id': req.body.senderId,
                'friendsList.friendId': {$ne: req.user._id}
            },{
                $push: {friendsList: {
                    friendId: req.user._id,
                    friendName: req.user.username
                }},
                $pull: { sentRequest: {
                    username: req.user.username
                }},
            }, (err) => {
                if(err){ 
                    console.log(err);
                }
            });
    
            res.redirect('/settings/profile');
        }
        if(req.body.user_Id){
            await User.update({
                '_id': req.user._id,
                'request.userId': {$eq: req.body.user_Id}
            },{
                $pull: { request: {
                    userId: req.body.user_Id
                }},
                $inc: { totalRequest: -1 }
            }, (err) => {
                if(err){ 
                    console.log(err);
                }
            });

            await User.update({
                '_id': req.body.user_Id,
                'sentRequest.username': {$eq: req.user.username}
            },{
                $pull: { sentRequest: {
                    username: req.user.username
                }},
            }, (err) => {
                if(err){ 
                    console.log(err);
                }
            });
    
            res.redirect('/settings/profile');
        }
        if(req.body.chatId){
            const updateM = await Message.update({
                '_id': req.body.chatId
            },{
                "isRead": true
            });

            res.redirect('/settings/profile');
        }

        const user1 = await User.findOne({ '_id': req.user._id });

        if(req.body.upload === null || req.body.upload === ''){

            const user1Update = await User.update({
                '_id': req.user._id
            },{
                username: req.body.username,
                fullname: req.body.fullname,
                country: req.body.country,
                mantra: req.body.mantra,
                gender: req.body.gender,
                userImage: user1.userImage
            },{
                upsert: true,
                new: true
            });
            console.log(user1Update);

            res.redirect('/settings/profile');

        }else if(req.body.upload !== null || req.body.upload !== ''){

            const user1Update = await User.update({
                '_id': req.user._id
            },{
                username: req.body.username,
                fullname: req.body.fullname,
                country: req.body.country,
                mantra: req.body.mantra,
                gender: req.body.gender,
                userImage: req.body.upload
            },{
                upsert: true,
                new: true
            });
            console.log(user1Update);

            res.redirect('/settings/profile');

        }

    }catch(err){
        console.log(err);
    }

};