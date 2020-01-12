const passport = require('passport');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const multer = require('multer');
const sharp = require('sharp');

const Club = require('./../models/clubModel');


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
    .resize(500, 500)
    .toFile(`public/uploads/${req.file.filename}`);
  }catch(err) {
    console.log(err);
  }

  next();
};




module.exports.adminPage = (req, res) => {
    return res.render('admin/dashboard');
};

module.exports.adminPostPage = (req, res) => {
    const newClub = new Club();
    newClub.name = req.body.club;
    newClub.country = req.body.country;
    newClub.image = req.body.upload;
    newClub.save( async(err)=> {
        res.render('admin/dashboard');
    });
};
