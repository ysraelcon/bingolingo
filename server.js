
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

Mgs.Promise = global.Promise;
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
var usrsroom={};
var usrjue={};

//user{_id,email,firstnm,lastnm,chats[]}

io.sockets.on('connection', function(socket) {
  
  console.log("en conexion "+socket.request.user.firstnm);
  
//----click on chat
  
socket.on("userva",function(dt){
//dt
  console.log("se conectó "+ socket.request.user.firstnm);
 if(socket.request.user){

usrscnnt[socket.request.user._id]= {user: socket.request.user,
          sktid:socket.id};

io.sockets.emit('usernames', usrscnnt);
   
}//if usr lgged
//console.log(socket.request.user.logged_in);
});//skon user va

  
  
//----open room
  
socket.on('open room',function(dt){
 //dt="gnrl" room
  
  if(!usrsroom[dt]){
   usrsroom[dt]={};
}//if indef
  //console.log(usrsroom[dt])
  usrsroom[dt][socket.request.user._id]= socket.request.user.firstnm;
  ////usrsroom{"roomx":{id1:name1,}}
  //usrsgnrl[socket.request.user._id]= socket.request.user.firstnm;
  
  socket.join(dt);
  console.log(io.sockets.adapter.rooms[dt]);   
  
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
             function(err,cht){

  if(!cht.chats[dt]){
//cht.chats[dt.roombth]=["hi"]; 
//cht.chats={};
cht.chats[dt]=[];
}//if no existe, crea
  
  cht.markModified("chats."+dt);

  //console.log(cht.chats);
  
cht.save((err)=>{
 if(err) throw err;
  //console.log("savedddd");
   
  io.to(dt).emit('mndusrroom',
                {usrsroom:usrsroom[dt],
       chtroom:cht.chats[dt],
       sktid:socket.id,
        room:dt});
  io.sockets.emit("actlz rooms",
                  {usrsroom:usrsroom[dt],
       chtroom:cht.chats[dt],
       sktid:socket.id,
        room:dt});
    
});//save
  
});//findone
      
});//skon abre general
  
  
socket.on('send message room', function(dt) {
    //dt{msg(inimsgval),room}
    
  dt.msg=emoji.emojify(dt.msg);
   
  Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
              function(err,cht){

var consav=socket.request.user.firstnm+": "+dt.msg;
if(cht.chats[dt.room].length<15){
 cht.chats[dt.room].push(consav);
}else{
cht.chats[dt.room].shift();
cht.chats[dt.room].push(consav);
}//else shift and push

cht.markModified("chats."+dt.room);
cht.save((err)=>{
 if(err) throw err;
});//save
});//findone
    
   io.to(dt.room).emit('new message room',
              {msg:dt.msg,
          nick:socket.request.user.firstnm,
              room:dt.room});
});//sk send msg


socket.on("cerr room",function(dt){
  //dt="roombth o gnrl" room

socket.leave(dt);
  
  if(!socket.id) return;
  delete usrsroom[dt][socket.request.user._id];
  io.to(dt).emit('mndusrroom',
                {usrsroom:usrsroom[dt],
                 room:dt});
  io.to(socket.id).emit('mndusrroom',
                {usrsroom:usrsroom[dt],
                 room:dt});
  io.sockets.emit("actlz rooms",
                {usrsroom:usrsroom[dt],
                 room:dt});

  /*else{
 
  socket.leave(dt);
 
  io.to(dt).emit("dejar prv",dt); 
}//else el prv   */  
});//skon cerrar room  
  
  
socket.on("typing gnrl",function(){
  //console.log("typing "+socket.request.user.firstnm);
  
  socket.broadcast.emit("who type", socket.request.user.firstnm);
  
});//typing
  
  
  
 socket.on("reporte",function(dt){
//dt{tit,rpt}
console.log("guarda reporte");
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
              function(err,cht){

cht.reportes.push(
     [socket.request.user.id,
      socket.request.user.firstnm,
       dt]);

cht.save((err)=>{
 if(err) throw err;
});//save
});//findone

});//reporte 
  
  
//====private chats
  
socket.on("mnd chtrqs",function(dt){
  //dt{sktidrcv,sktidmnd}
  console.log("2hizo cht rqst");
  
  var idmnd=socket.request.user._id;
  
  var usridrcv="";

for(var usri in usrscnnt){
  if(usrscnnt[usri].sktid== dt.sktidrcv){
usridrcv=usri;
break;
}//if
}//for
  
  var roombth=idmnd> usridrcv?
         idmnd+"_"+usridrcv:
         usridrcv+"_"+idmnd;
  
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
  nmercv:usrscnnt[usridrcv].user.firstnm,
           roombth:roombth});
    
  });//skon hicieron request
 
  
  socket.on("abr chtrqs",function(dt){
   //dt{roombth,sktidmnd}
    
    console.log("4abr chtrqs");
    
    socket.join(dt.roombth);
    
 console.log(io.sockets.adapter.rooms[dt.roombth]);
   var nmercv=socket.request.user.firstnm;
    
    var usridmnd="";

for(var usri in usrscnnt){
  if(usrscnnt[usri].sktid== dt.sktidmnd){
usridmnd=usri;
break;
}//if
}//for
    
   var nmemnd=usrscnnt[usridmnd].user.firstnm;
   
   io.to(dt.sktidmnd).emit("aceptd chtrqs",
            {nmercv:nmercv,nmemnd:nmemnd,
            sktidrcv:dt.sktidrcv,
            sktidmnd:dt.sktidmn,
            roombth:dt.roombth});
  });//abr chtrqs
  
  
socket.on("usrs pa chtrqs",function(dt){
 //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("6usrs pa chtrqs");
  
  //buscar 30 lines chat historial aqui !!!
  var id12=dt.roombth.split("_");
  
  var chtprv;
  
  User.findOne({_id:id12[0]},
  function(err,usr){
    
    console.log(id12[0]);
if(!usr.chats ){
//usr.chats[dt.roombth]=["hi"]; 
usr.chats={};
usr.chats[dt.roombth]=[];
}//if no existe, crea


usr.markModified("chats."+dt.roombth);
    console.log(usr.chats);
  chtprv=usr.chats[dt.roombth];
console.log(chtprv);
usr.save((err)=>{
 if(err) throw err;
  console.log("savedddd");
   dt["chtprv"]=chtprv;
  console.log(dt);
    io.to(dt.roombth).emit("mete usrs chtrqs", dt);
});//save

});//findone
   
 
});//skon users pa chat request
  
  
socket.on("send messagecht_r",function(dt){
    //dt{msg,roombth}
  
  var id12=dt.roombth.split("_");
 
  dt.msg=emoji.emojify(dt.msg);
  
  User.findOne({_id:id12[0]},
  function(err,usr){
    
var consav=socket.request.user.firstnm+": "+dt.msg;
if(usr.chats[dt.roombth].length<15){
 usr.chats[dt.roombth].push(consav);
}else{
usr.chats[dt.roombth].shift();
usr.chats[dt.roombth].push(consav);
}//else shift and push

usr.markModified("chats."+dt.roombth);
usr.save((err)=>{
 if(err) throw err;
});//save
});//findone
  
  io.to(dt.roombth).emit("new msgchtrqs",
                        {msg:dt.msg,
        nick:socket.request.user.firstnm,
                    room:dt.roombth});
});//skon send message chat rquest
  
  
  
  
  
  
//=====jueg  
socket.on('entroomj',function(dt){
 //dt {idjue,nroply,nmejue,lisjue}
  console.log("3entrando al juego");
  
  
socket.join(dt.idjue);
usrjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
           sktid:socket.id};
  
io.to(dt.idjue).emit("mndusrjue",
                     {usrjue:usrjue,
                      room:dt.idjue,
                nroply:dt.nroply,
                nmejue:dt.nmejue,
                lisjue:dt.lisjue});
socket.broadcast.emit("juego creado",
                {room:dt.idjue,
                nroply:dt.nroply,
                nmejue:dt.nmejue,
                lisjue:dt.lisjue});
    
});//skon entra juego
 
  var lis1=["one","two","three","four","five",
           "six","seven","eight","nine","ten"];
  
  var tmp=0;
  var wrdtogss="";

socket.on("10 seg",function(dt){
 console.log(tmp);
 if(tmp!=0){ 
 tmp=10;
 }else{
   var x=setInterval(function(){
 tmp--;
 io.to(dt.room).emit("corre reloj",{tmp:tmp});
 console.log(tmp);
if(tmp>0){
  
  }
else{
  clearInterval(x);
  io.to(dt.room).emit("next turn",
                      {nxttrnply:"pedro"});
  }
},1000);
 }//else corre de nuevo
});//10 seg para next turn player    
  
socket.on("start game",function(dt){
  //dt{room,nroply,nmejue,lisjue}
  console.log("5start game");
  io.to(usrjue[Object.keys(usrjue)[3%3]].sktid)
    .emit("el del turno",{wrd:lis1[2]});
  
  socket.to(dt.room).broadcast.emit("los que adivinan",
         {usrexpl: usrjue[Object.keys( usrjue)[3%3]].firstnm});
  
  wrdtogss=lis1[2];
  tmp=30;//90
  console.log("corre reloj "+tmp);
var x=setInterval(function(){
 tmp--;
 io.to(dt.room).emit("corre reloj",{tmp:tmp});
 
if(tmp>0){
  
  }
else{
  clearInterval(x);
  io.to(dt.room).emit("no se adivino",
                      {wrdtogss:wrdtogss});
  }
},1000);

  
});//skon start game  
  


  
  
socket.on('send messagejue',function(data){
  //data:injmsg(val)
  
  
    var re=new RegExp(wrdtogss,"i");
  if(re.test(data)){
    var gss=true;
    
  }//if
  
  
  data=emoji.emojify(data);
  
   io.sockets.emit('new messagejue',
                   {msg:data,
        nick:socket.request.user.firstnm,
                   guess:gss});
});//sk send msg juego
  
   
socket.on("slrjue",function(dt){
  //dt{room}
  console.log("sale del jue"),
 
    socket.leave(dt.room);
    
  delete usrjue[socket.request.user._id];
  io.sockets.emit("mndusrjue",
                  {usrjue:usrjue});
});//sk salir del juego
  
  
  
  
socket.on('disconnect', function(data) {

  if(!socket.id) return;
  delete usrscnnt[socket.request.user._id];
  updtusrscnnT();
  
  console.log("se desconecto "+ socket.request.user.firstnm);
  
  if(!socket.request.user.firstnm) return;
  delete usrsgnrl[socket.request.user._id];
  updtusrsgnrL();
  
   delete usrjue[socket.request.user._id];
  io.sockets.emit("mndusrjue",usrjue);
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
