
require('dotenv').config();

var Exp = require('express');
var bdp= require("body-parser");
var Ap = Exp();
var svr= require("http").createServer(Ap);
var io= require("socket.io").listen(svr);
var psspskio= require('passport.socketio');
var Mgn= require('morgan');
var Mgs= require("mongoose");
var expejsly= require('express-ejs-layouts');
var Fl= require('connect-flash');
var ckp= require('cookie-parser');
var Ss= require('express-session');
var mngstr= require('connect-mongo')(Ss);
var pssp= require('passport');

var port=process.env.PORT||3000;
svr.listen(port, process.env.IP);

Mgs.connect(process.env.DB_URI, {useMongoClient:true});
var sesstr=new mngstr({mongooseConnection:Mgs.connection});


require('./config/passport')(pssp);

Ap.use(bdp.json());
Ap.use(bdp.urlencoded({extended:true}));
Ap.use(ckp());
Ap.use(Mgn('dev'));


Ap.set('view engine','ejs');
Ap.use(expejsly);


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
//Ap.use(Exp.static(__dirname+'/public'));

//rutas
//Ap.use(require('./app/routes'));
require('./app/routes')(Ap,pssp);


var usrscnnt={};
var usrsgnrl={};

io.sockets.on('connection', function(socket) {
  

socket.on("userva",function(dt){
console.log(dt);
 if(socket.request.user){

socket.nickname=socket.request.user.firstnm;
usrscnnt[socket.nickname]=1;
updtusrscnnT();
}//if usr lgged
console.log(socket.request.user.logged_in);
});//skon user va
  

socket.on("opngnrl",function(){
  usrsgnrl[socket.request.user.firstnm]=1;
  io.sockets.emit('mndusrgnrl',usrsgnrl);
});//skon abre general  
  
  socket.on('send message', function(data) {
   io.sockets.emit('new message', {msg: data, nick: socket.nickname});
});//sk send msg
  
  socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
//        delete nicknames[socket.nickname];
 //       updateNickNames();
    });//skon disconnect
  
  
  function updtusrscnnT() {
        io.sockets.emit('usernames', usrscnnt);
    }//update nicknames
  
});//skcn socket connection


// listen for requests :)
/*var listener = Ap.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/
