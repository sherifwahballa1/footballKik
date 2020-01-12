const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');

module.exports.getchatPage = async (req, res, next) => {
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

    const myMessagesFromFriends = await Message.find({'$or': [
        {'senderName': req.user.username },
        {'receiverName': req.user.username }
    ]}).populate('sender').populate('receiver');

    const params = req.params.name.split('.');
    const nameParams = params[0];

    res.render('private/privatechat', { title: 'Footballkik - Private Chat', user: req.user, chat:messages ,groupName: name, dat: userData, chats: myMessagesFromFriends, name: nameParams });
};

module.exports.chatPostPage = async(req, res, next) => {
    try{
        const params = req.params.name.split('.');
        const nameParams = params[0];
        const nameRegex = new RegExp("^"+nameParams.toLowerCase(), "i");

        if(req.body.message){
           const receiverData =  await User.findOne({ 'username': { $regex: nameRegex }});
           const newMessage = new Message();
           newMessage.sender = req.user._id;
           newMessage.receiver = receiverData._id;
           newMessage.senderName = req.user.username;
           newMessage.receiverName = receiverData.username;
           newMessage.message = req.body.message;
           newMessage.userImage = req.user.userImage;
           newMessage.createdAt = new Date();

           await newMessage.save((err, result)=>{
               if(err){
                   return next(err);
               }
               console.log(result);
           });

           res.redirect('/chat/'+req.params.name);
        }

        if(req.body.chatId){
           const updateM = await Message.update({
                '_id': req.body.chatId
            },{
                "isRead": true
            });

            res.redirect('/chat/'+req.params.name);
        }

    }catch(err){
        console.log(err);
    }
};