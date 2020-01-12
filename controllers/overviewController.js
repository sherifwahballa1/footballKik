const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');
const groupMessage = require('../models/groupchatMessageModel');

module.exports.getOverviewPage = async(req, res, next) => {
    const name = req.params.name;
    const userData = await User.findOne({ 'username': name }).populate('request.userId');
    
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

    res.render('user/overview', { title: 'Footballkik - Overview', user: req.user, dat: userData, chat:messages });
};

// module.exports.getOverviewPostPage = async(req, res, next) => {
//     try{
//         if(req.body.receiver){
//             await User.update(
//                 {
//                 'username': req.body.receiver,
//                 'request.userId': { $ne: req.user._id},
//                 'friendsList.friendId': {$ne: req.user._id}
//                 },
//                 {
//                     $push: { request: {
//                         userId: req.user._id,
//                         username: req.user.username
//                     }},
//                     $inc: {totalRequest: 1}
//                 });

//             await User.update({
//                     'username': req.user.username,
//                     'sentRequest.username': {$ne: req.body.receiver}
//                 },
//                 {
//                     $push: {
//                         sentRequest: {
//                             username: req.body.receiver
//                         }
//                     }
//                 });

//                 res.redirect('/profile/'+req.params.name);
//         }
//         if(req.body.senderId){
//             await User.update({
//                 '_id': req.user._id,
//                 'friendsList.friendId': {$ne: req.body.senderId}
//             },{
//                 $push: {friendsList: {
//                     friendId: req.body.senderId,
//                     friendName: req.body.senderName
//                 }},
//                 $pull: { request: {
//                     userId: req.body.senderId,
//                     username: req.body.senderName
//                 }},
//                 $inc: { totalRequest: -1 }
//             }, (err) => {
//                 if(err){ 
//                     console.log(err);
//                 }
//             });

//             await User.update({
//                 '_id': req.body.senderId,
//                 'friendsList.friendId': {$ne: req.user._id}
//             },{
//                 $push: {friendsList: {
//                     friendId: req.user._id,
//                     friendName: req.user.username
//                 }},
//                 $pull: { sentRequest: {
//                     username: req.user.username
//                 }},
//             }, (err) => {
//                 if(err){ 
//                     console.log(err);
//                 }
//             });
    
//             res.redirect('/profile/'+req.params.name);
//         }
//         if(req.body.user_Id){
//             await User.update({
//                 '_id': req.user._id,
//                 'request.userId': {$eq: req.body.user_Id}
//             },{
//                 $pull: { request: {
//                     userId: req.body.user_Id
//                 }},
//                 $inc: { totalRequest: -1 }
//             }, (err) => {
//                 if(err){ 
//                     console.log(err);
//                 }
//             });

//             await User.update({
//                 '_id': req.body.user_Id,
//                 'sentRequest.username': {$eq: req.user.username}
//             },{
//                 $pull: { sentRequest: {
//                     username: req.user.username
//                 }},
//             }, (err) => {
//                 if(err){ 
//                     console.log(err);
//                 }
//             });
    
//             res.redirect('/profile/'+req.params.name);
//         }
//         if(req.body.chatId){
//             const updateM = await Message.update({
//                 '_id': req.body.chatId
//             },{
//                 "isRead": true
//             });

//             res.redirect('/profile/'+req.params.name);
//         }

//     }catch(err){
//         console.log(err);
//     }
// };
