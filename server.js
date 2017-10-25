
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
 store:sesstr,
 resave:false,
 saveUninitialized:true,
 secret:process.env.SECRET
  
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
Ap.use(Exp.static(__dirname+'/public'));

//rutas
//Ap.use(require('./app/routes'));
require('./app/routes')(Ap,pssp);


io.sockets.on('connection', function(skt) {
  
    
  skt.on('send message', function(data) {
   io.sockets.emit('new message', {msg: data, nick: skt.nickname});
});//sk send msg
  
  skt.on('disconnect', function(data) {
        if(!skt.nickname) return;
//        delete nicknames[socket.nickname];
 //       updateNickNames();
    });//skon disconnect
  
  
});//skcn socket connection


// listen for requests :)
var listener = Ap.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
