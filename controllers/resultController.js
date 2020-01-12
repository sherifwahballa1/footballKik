const _  = require('lodash');

const User = require('../models/usersModel');
const Club = require('../models/clubModel');

module.exports.getResults = (req, res) => {
    res.redirect('/home');
};

module.exports.postResults = async(req, res) => {
    try{
        const regex = new RegExp((req.body.country), 'gi');
        const countryClubs = await Club.find({'$or': [{ 'country': regex }, { 'name': regex }]});

        const dataChunk = [];
        const chunkSzie = 3;
        for(let i = 0 ; i< countryClubs.length; i+=chunkSzie){
            dataChunk.push(countryClubs.slice(i, i+chunkSzie));
        }

        res.render('results', { title: 'Footballkik - Home', user: req.user ,chunks: dataChunk });

    }catch(err){
        console.log(err);
    }
};