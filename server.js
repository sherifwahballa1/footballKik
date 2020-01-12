/*these modules use once */
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const passport = require('passport');
const formidable = require('formidable');
const socketIO =  require('socket.io');
const dotenv = require('dotenv');
const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/Global');
const helmet = require('helmet');
const compression = require('compression');

const usersRouter = require('./routers/usersRouter');
const adminRouter = require('./routers/adminRouter');
const homeRouter = require('./routers/homeRouter');
const groupRouter = require('./routers/groupRouter');
const resultRouter = require('./routers/resultRouter');
const privatechatRouter = require('./routers/privatechatRouter');
const membersRouter = require('./routers/membersRouter');
const profileRouter = require('./routers/profileRouter');
const interestRouter = require('./routers/interestRouter');
const overviewRouter  = require('./routers/overviewRouter');
const newsRouter  = require('./routers/newsRouter');
const passportLocal = require('./passport/passport-local');
const passportFacebook = require('./passport/passport-facebook');
const passportGoogle = require('./passport/passport-google');
const configF = require('./secret/secretFile');


const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

dotenv.config({ path: './config.env' });
app.use(compression());
app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'helpers')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.locals._ = _;


mongoose.connect(`${process.env.DB}&w=${process.env.w}`, {useMongoClient: true}, (err)=>{
  if(err){
    console.log(err);
  }else{
    console.log('Successfullu Connect To DB');
  }
});

app.use('/', usersRouter);
app.use('/', adminRouter);
app.use('/', homeRouter);
app.use('/', groupRouter);
app.use('/', resultRouter);
app.use('/', privatechatRouter);
app.use('/', membersRouter);
app.use('/', profileRouter);
app.use('/', interestRouter);
app.use('/', overviewRouter);
app.use('/', newsRouter);

app.use(function(req, res){
  res.render('404');
});

const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

const users = new Users();
io.on('connection', (socket) => {
  console.log('User Connected');

  socket.on('join', (params, callback) => {
    socket.join(params.room);

    users.AddUserData(socket.id, params.name, params.room);
    
    io.to(params.room).emit('usersList', users.GetUsersList(params.room));

     callback();
  });

   socket.on('createMessage', (message, callback) => {
     io.to(message.room).emit('newMessage', {
       text: message.text,
       room : message.room,
       from: message.sender,
       image: message.userPic
     });
    callback();
   });

  socket.on('disconnect', () => {
    var user = users.RemoveUser(socket.id);
    if(user){
      io.to(user.room).emit('usersList', users.GetUsersList(user.room));
    }
  });

});

//freind request

io.on('connection', (socket) => {
  socket.on('joinRequest', (myRequest, callback) => {
    socket.join(myRequest.sender);
    callback();
  });

  socket.on('friendRequest', (friend, callback) => {
    io.to(friend.receiver).emit('newFriendRequest', {
        from: friend.sender,
        to: friend.receiver
    });

    callback();
  });
});

//Global Room (online friends)
const clients = new Global();

io.on('connection', (socket) => {
  socket.on('global room', (global) => { //listening this funtion from client side
    socket.join(global.room);

    clients.EnterRoom(socket.id, global.name, global.room, global.img);

    const nameProp = clients.GetRoomList(global.room);
    const arr = _.uniqBy(nameProp, 'name');
    
    io.to(global.room).emit('loggedInUser', arr);
  });

  socket.on('disconnect', () => {
    const user = clients.RemoveUser(socket.id);
    if(user){
      var userData = clients.GetRoomList(user.room);
      const arr = _.uniqBy(userData, 'name');
      const removeData = _.remove(arr, {'name': user.name})
      io.to(user.room).emit('loggedInUser', arr);
    }
  });

});


//private chat

io.on('connection', (socket) => {
  socket.on('join PM', (pm)=>{
    socket.join(pm.room1);
    socket.join(pm.room2);
  });

  socket.on('private message', (message, cb) => {
    io.to(message.room).emit('new message', {
      text: message.text,
      sender: message.sender
    });
    
    io.emit('message display', {});

    cb();
  });

  socket.on('refresh', function(){
    io.emit('new refresh', {});
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
// const io = socketIO(server);

