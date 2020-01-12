const multer = require('multer');
const sharp = require('sharp');
const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');
const Message = require('../models/messageModel');

module.exports.homePage = async(req, res) => {
     
    try {
    const clubs = await Club.find({});
    const dataChunk = [];
    const chunkSzie = 3;
    for(let i = 0 ; i< clubs.length; i+=chunkSzie){
        dataChunk.push(clubs.slice(i, i+chunkSzie));
    }

    const clubswithCounty = await Club.aggregate([{
        $group: {
          _id: "$country"
        }
      }]).sort('_id');

      const userData = await User.findOne({ 'username': req.user.username }).populate('request.userId');

      const messages = await Message.aggregate(
        [
            { $match: { $or: [
            {'senderName': req.user.username },
            {'receiverName': req.user.username}] }
        },
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

     res.render('home', { title: 'Footballkik - Home', user: req.user, data: dataChunk, data2: clubswithCounty, dat: userData, chat: messages});
    }catch(err) {
        console.log(err);
    }
};

module.exports.homePageWithCountry = countyName = async(req, res) => {
     
    try {
    const clubswithCounty = await Club.find({ county: `${countyName}`});
        console.log(clubswithCounty);
    }catch(err) {
        console.log(err);
    }
};

module.exports.postHomePage = async(req, res) => {
     try{
        await Club.update({
                '_id': req.body.id,
                'fans.username': {$ne: req.user.username }
            },{
                $push: {fans: {
                    username: req.user.username,
                    email: req.user.email
                }}
            },(err, result)=>{
                res.redirect('/home');
            }
            );

            if(req.body.chatId){
                const updateM = await Message.update({
                     '_id': req.body.chatId
                 },{
                     "isRead": true
                 });
     
                 res.redirect('/chat/'+req.params.name);
             }
       // res.redirect('/home');
    }catch(err){
        console.log(err);
    }

};


module.exports.logout = (req, res)=>{
    req.logout(); // function in passport
    req.session.destroy((err)=>{
        res.redirect('/');
    });
};