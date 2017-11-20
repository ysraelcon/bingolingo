
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
var expvtr= require('express-validator');
var mngstr= require('connect-mongo')(Ss);
var 
pssp= require('passport');
var emoji= require('node-emoji');

var port=process.env.PORT||3000;
svr.listen(port, process.env.IP);

Mgs.connect(process.env.DB_URI, {useMongoClient:true});
var sesstr=new mngstr({mongooseConnection:Mgs.connection});


require('./config/passport')(pssp);
Ap.use(Exp.static(__dirname+'/client')); //para activar angularjs
Ap.use(bdp.json());
Ap.use(bdp.urlencoded({extended:true}));
Ap.use(expvtr());
Ap.use(ckp());
Ap.use(Mgn('dev'));


Ap.set('view engine','ejs');//ejs html
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


//======socket part

var Chat=require('./app/models/chat');
var User=require('./app/models/user');

//usrscnnt{usrid:{user,sktcltid}}
var usrscnnt={};
var usrsgnrl={};
var usrjue={};

//user{_id,email,firstnm,lastnm,chats[]}

io.sockets.on('connection', function(socket) {
  

socket.on("userva",function(dt){
//dt=sktclt.id //con user_id !!!
  //console.log(socket.id);
 if(socket.request.user){

usrscnnt[dt]= socket.request.user;

updtusrscnnT();
updtusrsgnrL();   
}//if usr lgged
//console.log(socket.request.user.logged_in);
});//skon user va

  
  

socket.on('opngnrl',function(dt){
 //dt="gnrl" room   
  usrsgnrl[socket.request.user._id]= socket.request.user.firstnm;
  
  socket.join(dt);
  console.log(io.sockets.adapter.rooms[dt]);   
  
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
             function(err,cht){

 io.sockets.emit('mndusrgnrl',
                {usrsgnrl:usrsgnrl,
       chtgnrl:cht.chats.general,
       sktid:socket.id});     

});//findone
      
});//skon abre general
  
  
socket.on('send message', function(dt) {
    //dt{msg(inimsgval),room}
    
  dt.msg=emoji.emojify(dt.msg);
   
  Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
              function(err,cht){

cht.chats.general.shift();
      
cht.chats.general.push( socket.request.user.firstnm+": "+dt.msg);

cht.save((err)=>{
if(err) throw err;
});//cht.save

});//findone
    
   io.to(dt.room).emit('new message',
              {msg:dt.msg,
          nick:socket.request.user.firstnm,
              room:dt.room});
});//sk send msg


socket.on("cerrgnrl",function(dt){
  //dt="general" room
  
  socket.leave(dt);
  
  if(!socket.id) return;
  delete usrsgnrl[socket.request.user._id];
  updtusrsgnrL();
    
});//skon cerrar general
  
  
  
//====private chats
  
socket.on("mnd chtrqs",function(dt){
  //dt{sktidrcv,sktidmnd}
  console.log("2hizo cht rqst");
  
  var idmnd=socket.request.user._id;
    
  var roombth=idmnd> usrscnnt[dt.sktidrcv]._id?
         idmnd+"_"+usrscnnt[dt.sktidrcv]._id:
         usrscnnt[dt.sktidrcv]._id+"_"+idmnd;
  
  socket.join(roombth);
  
 console.log(io.sockets.adapter.rooms[roombth]);   
  socket.to(dt.sktidrcv).emit("recibe chtrqs",
        {nmemnd:socket.request.user.firstnm,
       sktidmnd:dt.sktidmnd,
     sktidrcv:dt.sktidrcv,
           roombth:roombth
         }); //sktcltid de quien la manda
    
    io.to(roombth).emit("espera chtrqs",
          {sktidmnd:dt.sktcltid,
           sktidrcv:dt.sktidrcv,
           roombth:roombth});
    
  });//skon hicieron request
 
  
  socket.on("abr chtrqs",function(dt){
   //dt{roombth,sktidmnd}
    
    console.log("4abr chtrqs");
    
    socket.join(dt.roombth);
    
 console.log(io.sockets.adapter.rooms[dt.roombth]);
   var nmercv=socket.request.user.firstnm;
   var nmemnd=usrscnnt[dt.sktidmnd].firstnm;
   
   io.to(dt.sktidmnd).emit("aceptd chtrqs",
            {nmercv:nmercv,nmemnd:nmemnd,
            sktidrcv:dt.sktidrcv,
            sktidmnd:dt.sktidmn,
            roombth:dt.roombth});
  });//abr chtrqs
  
  
socket.on("usrs pa chtrqs",function(dt){
 //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("6usrs pa chtrqs");
    io.to(dt.roombth).emit("mete usrs chtrqs",dt);
});//skon users pa chat request
  
  
socket.on("send messagecht_r",function(dt){
    //dt{msg,roombth}
  
  dt.msg=emoji.emojify(dt.msg);
  
  io.to(dt.roombth).emit("new msgchtrqs",
                        {msg:dt.msg,
        nick:socket.request.user.firstnm,
                    room:dt.roombth});
});//skon send message chat rquest
  
  
  
  
//=====jueg  
socket.on('entroomj',function(room){
  
socket.join(room);
usrjue[socket.request.user._id]= socket.request.user.firstnm;
io.to(room).emit("mndusrjue",usrjue);
    
});//skon entra juego
 
  
socket.on('send messagejue',function(data){
  //data:injmsg(val)
  
   io.sockets.emit('new messagejue',
                   {msg:data,
        nick:socket.request.user.firstnm});
});//sk send msg juego
  
   
socket.on("slrjue",function(dt){
  console.log("sale del jue"),

  delete usrjue[socket.request.user._id];
  io.sockets.emit("mndusrjue",usrjue);
});
  
  
  
  
socket.on('disconnect', function(data) {

  if(!socket.id) return;
  delete usrscnnt[socket.id];
  updtusrscnnT();
  console.log("se desconecto "+ socket.request.user.firstnm);
  if(!socket.request.user.firstnm) return;
  delete usrsgnrl[socket.request.user._id];
  updtusrsgnrL();
});//skon disconnect
  
  
  
function updtusrscnnT() {
  io.sockets.emit('usernames', usrscnnt);
}//update nicknames
  
  
function updtusrsgnrL() {
    
 io.sockets.emit('mndusrgnrl', {usrsgnrl:usrsgnrl});
}//update nicknames
  
});//skcn socket connection


// listen for requests :)
/*var listener = Ap.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/
