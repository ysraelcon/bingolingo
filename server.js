//environment variables
require('dotenv').config();

var Exp= require('express'),
 bdp= require('body-parser'),
 Ap=Exp();
var server = require('http').createServer(Ap);
var io = require("socket.io").listen(server);
var psspskio = require('passport.socketio');
var Mrg= require('morgan'),
 Mng= require('mongoose'),
 Fl= require('connect-flash'),
 ckp= require('cookie-parser'),
 Ss= require('express-session'),
 mngstr= require('connect-mongo')(Ss),
 pssp= require('passport');


var config= require('./config/db');
//server.listen(8000);
var port=process.env.PORT||3000;
server.listen(port, process.env.IP);

Mng.connect(process.env.DB_URI, {useMongoClient:true});
var sesstr=new mngstr({mongooseConnection:Mng.connection})

require('./config/passport')(pssp);
Ap.use(Exp.static(__dirname+'/client')); //para activar angularjs
Ap.use(bdp.json());
Ap.use(bdp.urlencoded({extended:true}));
Ap.use(ckp());
Ap.use(Mrg('dev'));
Ap.set('view engine','ejs');

Ap.use(Ss({
 secret:process.env.SECRET,
  saveUninitialized:true,
 resave:true,
  store:sesstr
}));

//passport.socketio
io.use(psspskio.authorize({
  key: 'connect.sid',
  secret: process.env.SECRET,
  store: sesstr,
  passport: pssp,
  cookieParser: ckp
}));

Ap.use(pssp.initialize());
Ap.use(pssp.session());
Ap.use(Fl());
require('./routes/routes')(Ap,pssp);

//Ap.listen(port);

var nicknames={};

io.sockets.on('connection', function(socket) {
  
  socket.on("ev1", function(dt){
    console.log(dt);
if (socket.request.user &&
 socket.request.user.logged_in) {
      console.log(socket.request.user.name);
   socket.nickname=socket.request.user.name;
   nicknames[socket.nickname]=1;
   updateNickNames();
    }//if
});//skon ev1
  
  socket.on('send message', function(data) {
   io.sockets.emit('new message', {msg: data, nick: socket.nickname});
});//sk send msg
  
  socket.on('disconnect', function(data) {
      console.log("se desconecto");
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });//skon disconnect
  
  
  function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
    }//update nicknames
  
});//skcn socket connection