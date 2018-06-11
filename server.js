
// 1.. 

require('dotenv').config();

var express = require('express');
var bdparser= require("body-parser");
var app = express();
var server= require("http").createServer(app);
var io= require("socket.io").listen(server);
var passportskio= require('passport.socketio');
var morgan= require('morgan');
var mongoose= require("mongoose");
var expressejsly= require('express-ejs-layouts');
var flash= require('connect-flash');
var ckparser= require('cookie-parser');
var exprsession= require('express-session');
var exprvalidator= require('express-validator');
var mongocnnt= require('connect-mongo')(exprsession);
var ndmailer= require('nodemailer');
var passport= require('passport');
var emoji= require('node-emoji');

var port= process.env.PORT||3000;
server.listen(port, process.env.IP);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {useMongoClient:true});
var sessionstr= new mongocnnt({mongooseConnection:mongoose.connection});


require('./config/passport')(passport);
app.use(express.static(__dirname+'/client')); //para activar angularjs
app.use(bdparser.json());
app.use(bdparser.urlencoded({extended:true}));
app.use(exprvalidator());
app.use(ckparser());
app.use(morgan('dev'));


app.set('view engine','ejs');//ejs html
app.use(expressejsly);


app.use(exprsession({
 secret:process.env.SECRET,
  saveUninitialized:true,
 resave:true,
  store:sessionstr
}));


//passport.socketio
io.use(passportskio.authorize({
  key: 'connect.sid',
  secret: process.env.SECRET,
  store: sessionstr,
  passport: passport,
  cookieParser: ckparser
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use(express.static(__dirname+'/public'));

//rutas
//app.use(require('./app/routes'));
require('./app/routes')(app,passport);

 

//====== 2.. socket part

var Chat= require('./app/models/chat');
var User= require('./app/models/user');


var userscnnt={};
//userscnnt{usrid:{user,sktid}}

var usersroom={};
//usersroom{rmf:{usridf:firstnm}}

var userssctrm={};
var usersjue={};
//usersjue{sktid:{firstnm,sktid},...}

//user{_id,email,firstnm,lastnm,chats[]}

//juego
var jue={};
/*
jue{juenro:{nrogme,tiempo,wrdtogss,typegme,
  listwrdnm,listwrd,playertrn,nroply,nroplyact},...}
*/
  
var listwrds= require("./wordlists.js");



//socket connection, poner variable afuera
io.sockets.on('connection', function(socket) {
  
  
  console.log("en conexion "+ socket.request.user.firstnm);

 console.log("lanza barras de juego");
  
  for(var juex in jue){
 if(Object.keys(jue[juex].nroplyact).length!=0){
 
 io.sockets.emit("los demas barjue",
               {nrogme: juex,
                typegme: jue[juex].typegme,
                listwrdnm: jue[juex].listwrdnm,
                nroply: jue[juex].nroply});

}//if hay jugadores
}//for
  
//----click on chat
  
socket.on("user va a chat",function(){

  console.log("entro a chat "+ socket.request.user.firstnm);
 if(socket.request.user){

userscnnt[socket.request.user._id]= {user: socket.request.user,
          sktid:socket.id};

io.sockets.emit('usernames', userscnnt);


for( var rm in usersroom){
io.to(socket.id).emit("actualizar rooms",
  {usersroom: usersroom[rm],
   room:rm});
  
}//for actualiza, cuando entra   
   
}//if usr lgged
//console.log(socket.request.user.logged_in);
});//skon user va a chat


  
//---- 2a.. open room
  
socket.on('open room',function(roomf){
 //roomf="gnrl" roomf
  
  if(!usersroom[roomf]){
   usersroom[roomf]={};
}//if indef
  //console.log(usersroom[roomf])
  usersroom[roomf][socket.request.user._id]= socket.request.user.firstnm;
  
  
  socket.join(roomf);
  console.log("joined in "+roomf);
  //console.log(io.sockets.adapter.rooms[roomf]);   
  
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
             function(err,chatf){

  if(!chatf.chats[roomf]){
//chatf.chats[roomf.roombth]=["hi"]; 
//chatf.chats={};
chatf.chats[roomf]=[];
}//if no existe, crea
  
  chatf.markModified("chats."+roomf);

  //console.log(chatf.chats);
  
chatf.save((err)=>{
 if(err) throw err;
  //console.log("savedddd");
   
  io.to(roomf).emit('manda users al room',
                {usersroom:usersroom[roomf],
       chtroom:chatf.chats[roomf],
       sktid:socket.id,
        room:roomf});
  io.sockets.emit("actualizar rooms",
                  {usersroom:usersroom[roomf],
       chtroom:chatf.chats[roomf],
       sktid:socket.id,
        room:roomf});
    
});//save
  
});//findone
  
  /* creado nuevo objeto, para chats prv, otro para reportes
  
  //_id chtsprv 5a36957e2659be546185f785
  //_id reportes 5a3694ecfe052c4f9add75ff
  var newChat=new Chat();
newChat.chtsprv= {};
newChat.save(function(err){
 if(err) throw err;
});//save
*/
      
});//skon abre general
  
  
  
socket.on('send message room', function(objmsgf) {
    //objmsgf{msg(inimsgval),room,typerm}
    
  objmsgf.msg= emoji.emojify(objmsgf.msg);
  objmsgf.msg= haber_link(objmsgf.msg);
  
  
  if(objmsgf.typerm==="public"){
  Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
              function(err,chatf){

var consav=socket.request.user.firstnm+": "+objmsgf.msg;
if(chatf.chats[objmsgf.room].length<15){
 chatf.chats[objmsgf.room].push(consav);
}else{
chatf.chats[objmsgf.room].shift();
chatf.chats[objmsgf.room].push(consav);
}//else shift and push

chatf.markModified("chats."+objmsgf.room);
chatf.save((err)=>{
 if(err) throw err;
});//save
});//findone
  }//if typerm public
    
   io.to(objmsgf.room).emit('new message room',
              {msg:objmsgf.msg,
          nick:socket.request.user.firstnm,
              room:objmsgf.room});
});//skon send msg


  
socket.on("cerrar room",function(roomf){
  //roomf="roombth o gnrl" room
console.log("cerró room "+roomf);
  
socket.leave(roomf);
  
  if(!socket.id) return;
  
  //console.log(usersroom[roomf]);
  if(usersroom[roomf])
  delete usersroom[roomf][socket.request.user._id];
  io.to(roomf).emit('manda users al room',
                {usersroom:usersroom[roomf],
                 room:roomf});
  /*
  io.to(socket.id).emit('manda users al room',
                {usersroom:usersroom[roomf],
                 room:roomf});*/
  io.sockets.emit("actualizar rooms",
                {usersroom:usersroom[roomf],
                 room:roomf});

  /*else{
 
  socket.leave(roomf);
 //corregir room privados !!!
  io.to(roomf).emit("dejar prv",roomf); 
}//else el prv   */  
});//skon cerrar room  
  
  
  
socket.on("typing",function(objroomf){
  //objroomf{room}
  
  socket.to(objroomf.room).broadcast.emit("who type",
                  {firstnm: socket.request.user.firstnm,
                     room:objroomf.room});
  
});//typing
  
  
  
 socket.on("reporte",function(objrptf){
//objrptf{tit,rpt}
console.log("guarda reporte");
Chat.findOne({_id:"5a3694ecfe052c4f9add75ff"},
              function(err,chatf){

chatf.reportes.push(
     [socket.request.user._id,
      socket.request.user.firstnm,
       objrptf]);

chatf.save((err)=>{
 if(err) throw err;
});//save
});//findone

});//reporte 
  
  
//===== 2b.. secret rooms
  
socket.on("slide in sct",function(roomsctf){
 //roomsctf=secret name's room
 
 if(!usersroom[roomsctf]){
   usersroom[roomsctf]={};
}//if indef
  //console.log(usersroom[roomsctf])
  usersroom[roomsctf][socket.request.user._id]= socket.request.user.firstnm;

socket.join(roomsctf);
  console.log(io.sockets.adapter.rooms[roomsctf]);

io.to(roomsctf).emit('manda users a sctroom',
             {usersroom:usersroom[roomsctf],
              sktid:socket.id,
              room:roomsctf});

});//skon slide in secret room
          
 

socket.on("ver su prf",function(objusrf){
 //objusrf{usridrcv,sktidrcv,sktidmnd}
console.log("ver su perfil");
console.log(objusrf); 
var usr={};  
User.findOne({_id:objusrf.usridrcv},
             (err,user)=>{
  //console.log(user);
usr.firstnm=user.firstnm;
usr.lastnm=user.lastnm;
usr.avatar=user.avatar;
usr.age=user.age;
usr.gender=user.gender;
usr.country=user.country;
usr.speaks=user.speaks;
usr.learning=user.learning;
usr.aboutme=user.aboutme;
  io.to(objusrf.sktidmnd).emit("perfil a ver",
  {user:usr,
   usridrcv:objusrf.usridrcv,
   sktidrcv:objusrf.sktidrcv});
});//findone  
  
});//skon ver su prf
  
  
  
//==== 2c.. private chats
  
socket.on("manda chatrqs",function(objusrf){
  //objusrf{sktidrcv,usridrcv,sktidmnd}
  console.log("2hizo chatrqst");
  console.log(objusrf);
  var idmnd=socket.request.user._id;
  
  var usridrcv=objusrf.usridrcv;
  
  var roombth=idmnd> usridrcv?
         idmnd+"_"+usridrcv:
         usridrcv+"_"+idmnd;
  
  if(!usersroom[roombth]){
   usersroom[roombth]={};
}//if indef
  //usersroom{rmnme{usrid:firstnm,...},...}
  usersroom[roombth][socket.request.user._id]= socket.request.user.firstnm;
  
  socket.join(roombth);
   
 console.log(io.sockets.adapter.rooms[roombth]); 
  
  io.to(objusrf.sktidrcv).emit("recibe chatrqs",
        {nmemnd:socket.request.user.firstnm,
       sktidmnd:objusrf.sktidmnd,
     sktidrcv:objusrf.sktidrcv,
           roombth:roombth
         }); //sktcltid de quien la manda
    
  if(userscnnt[usridrcv])
  var nmercv= userscnnt[usridrcv].user.firstnm;
  
    io.to(roombth).emit("espera chatrqs",
          {sktidmnd:objusrf.sktcltid,
           sktidrcv:objusrf.sktidrcv,
           nmercv:nmercv,
           roombth:roombth});
    
  });//skon hicieron request
 
  
  
  socket.on("cancel chatrqs",function(objusrf){
 //objusrf{sktidrcv,roombth}

//y sacarlo del room

 socket.to(objusrf.sktidrcv).emit("eliminar chatrqs",
    {roombth:objusrf.roombth});
});//skon cancel request
  
  
  
  
  socket.on("abrir chatrqs",function(objusrf){
   //objusrf{roombth,sktidmnd}
    
    console.log("4abre chatrqs");
    
    usersroom[objusrf.roombth][socket.request.user._id]= socket.request.user.firstnm;
    
    socket.join(objusrf.roombth);
    
 console.log(io.sockets.adapter.rooms[objusrf.roombth]);
   var nmercv=socket.request.user.firstnm;
    
   var usridmnd="";

for(var usri in userscnnt){
  if(userscnnt[usri].sktid== objusrf.sktidmnd){
usridmnd=usri;
break;
}//if
}//for
   
   if(userscnnt[usridmnd]) 
   var nmemnd=userscnnt[usridmnd].user.firstnm;
   
   io.to(objusrf.sktidmnd).emit("acepta chatrqs",
            {nmercv:nmercv,nmemnd:nmemnd,
            sktidrcv:objusrf.sktidrcv,
            sktidmnd:objusrf.sktidmn,
            roombth:objusrf.roombth});
  });//skon abrir chatrqs
  
  
  
socket.on("users al chatrqs",function(objusrf){
 //objusrf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("6users para chatrqs");
  
  //buscar 30 lines chat historial aqui !!!
  var id12= objusrf.roombth.split("_");
  
  var chatprv;
  
  Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,chatf){
    
   
    if(!chatf.chtsprv){
      chatf.chtsprv={};
    }//if no chatsprv, crear
    
    
if(!chatf.chtsprv[objusrf.roombth]){
      
chatf.chtsprv[objusrf.roombth]=[];
}//if no existe, crea
    
   chatf.markModified("chtsprv."+objusrf.roombth);
    
   chatprv=chatf.chtsprv[objusrf.roombth]; 
    
  chatf.save((err)=>{
 if(err) throw err;  
  
    
    objusrf["chatprv"]=chatprv;
    io.to(objusrf.roombth).emit("mete users en chatrqs", objusrf);
    
    
  });//save
});//findone
  
 
});//skon users pa chat request
  
  
  
socket.on("send messagecht_r",function(objmsgf){
    //objmsgf{msg,roombth}
  
  var id12= objmsgf.roombth.split("_");
 
  objmsgf.msg= emoji.emojify(objmsgf.msg);
  objmsgf.msg= haber_link(objmsgf.msg);
  
  
Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,chatf){
    
var consav=socket.request.user.firstnm+": "+objmsgf.msg;
if(chatf.chtsprv[objmsgf.roombth].length<15){
 chatf.chtsprv[objmsgf.roombth].push(consav);
}else{
chatf.chtsprv[objmsgf.roombth].shift();
chatf.chtsprv[objmsgf.roombth].push(consav);
}//else shift and push    
    
chatf.markModified("chtsprv."+objmsgf.roombth);    
chatf.save((err)=>{
 if(err) throw err;
});//save  
});//findone  
  
  
  io.to(objmsgf.roombth).emit("new msgchtrqs",
                        {msg:objmsgf.msg,
        nick:socket.request.user.firstnm,
                    room:objmsgf.roombth});
});//skon send message chat rquest
  

  
socket.on("solicitar llamada",function(objroomcllf){
 //objroomcllf{rmrtc:roombth}
console.log("solicita llamada");
 io.to(objroomcllf.rmrtc).emit("solicitud de aceptacion de la llamada",
  {rmrtc:objroomcllf.rmrtc, sktidmnd:socket.id,
   nmemnd: socket.request.user.firstnm});
  
});//skon solicitar llamada  
  
 
  
socket.on("cancelar llamada entrante", function(objroomcllf){
 //objroomcllf{rmrtc}
io.to(objroomcllf.rmrtc).emit("se cancelo llmd",
                    {rmrtc:objroomcllf.rmrtc});
});//skon cancelar llamada entr  
  

  
socket.on("correr llmd",function(objroomcllf){
 //objroomcllf{rmrtc}

io.to(objroomcllf.rmrtc).emit("correr webrtc",
                      {rmrtc:objroomcllf.rmrtc});
});//skon correr llmd  
  
 
socket.on("colgar llamada",function(objroomcllf){
 //objroomcllf{rmrtc}
io.to(objroomcllf.rmrtc).emit("se cuelga llmd",
                   {rmrtc:objroomcllf.rmrtc});
});//skon colgar llamada 
  
  
  
//guardar nota
socket.on("save note",function(objntef){
//objntef{nte}

User.findOne({_id: socket.request.user._id},
    function(err,userf){

if(!userf.notes){
 userf.notes="";
}

userf.notes=objntef.nte;

userf.save((err)=>{
if(err) throw err;
});//save
});//findone
console.log("saved note");
});//skon save note  
  
  
  
  
//===== 2d.. jueg  
  
  
socket.on("solicitar game",function(objgmef){
 //objgmef{typegme,listwrd,nroply}

console.log("2solicitar juego");
console.log(objgmef);
  
var nrogme= "jue"+Object.keys(jue).length;  

  
jue[nrogme]= {nrogme: nrogme,
              tiempo:0,
              mod:"",
              wrdtogss:"",
              typegme: objgmef.typegme,
              listwrdnm:objgmef.listwrd,
              listwrd: listwrds[objgmef.listwrd],
              playertrn:"", 
              nroply: objgmef.nroply,
              nroplyact: {}
             };//jue{}

io.to(socket.id).emit("crear juego",
             {nrogme: nrogme,
              typegme: objgmef.typegme,
              listwrd: objgmef.listwrd,
              nroply: objgmef.nroply });
//socket.broadcast.emit("los demas barjue",
io.sockets.emit("los demas barjue",
                {nrogme:nrogme,
                 typegme:objgmef.typegme,
                 listwrdnm:objgmef.listwrd,
                 nroply:objgmef.nroply});
  
});//skon solicitar game  
  
  
socket.on('entrar roomj',function(objgmef){
 //objgmef{nrogme,typegme,listwrd,nroply}
  console.log("3entrando al juego");
  console.log(objgmef);
    
var usrid= socket.request.user._id;
var fn=  socket.request.user.firstnm;

  if(!jue[objgmef.nrogme]){
    
    console.log("no hay "+objgmef.nrogme);
    io.sockets.emit("eliminar gmebar",
                 {rmgme:objgmef.nrogme});
    
    }else{//else hay jue
    
var nroingme= Object.keys(jue[objgmef.nrogme].nroplyact).length;
  
  
if(nroingme< (jue[objgmef.nrogme].nroply-1) ){
  console.log("cant menor que nroply-1");

  jue[objgmef.nrogme].nroplyact[usrid]=[fn,socket.id,0];
  //[fn,sktid,puntaje]
  
  console.log(typeof jue[objgmef.nrogme]);

socket.join(objgmef.nrogme);
usersjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
           sktid:socket.id};
  
 var usrgme= jue[objgmef.nrogme].nroplyact; 
io.to(objgmef.nrogme).emit("manda user al juego",
                     {usersjue:usrgme,
                      nrogme:objgmef.nrogme,
                      typegme:objgmef.typegme,
                      listwrd:objgmef.listwrd,
                      nroply:objgmef.nroply});

}//if nroplyact<nroply-1: junta

else if(nroingme== (jue[objgmef.nrogme].nroply-1) ){
  console.log("cant igual que nroply-1")

jue[objgmef.nrogme].nroplyact[usrid]=[fn,socket.id,0];
  //[fn,sktid,puntaje]
  
  
socket.join(objgmef.nrogme);
  
//decir que rmgme, para luego eliminarlo en disconnect
usersjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
           sktid:socket.id};
  
 var usrgme= jue[objgmef.nrogme].nroplyact; 
io.to(objgmef.nrogme).emit("manda user al juego",
                     {usersjue:usrgme,
                      nrogme:objgmef.nrogme,
                      typegme:objgmef.typegme,
                      listwrd:objgmef.listwrd,
                      nroply:objgmef.nroply});

//strgme(jue[objgmef.nrogme]);
  //start plyer 0 va sumando 0%nroply
var playertrn= 0;
jue[objgmef.nrogme].playertrn= 0;
  
var pmrid= Object.keys(jue[objgmef.nrogme].nroplyact)[playertrn];
var pmrusr= jue[objgmef.nrogme].nroplyact[pmrid];//[fn,sktid]

jue[objgmef.nrogme].wrdtogss= jue[objgmef.nrogme].listwrd[dar_aleatoriapos(0, jue[objgmef.nrogme].listwrd.length)];  
    
io.to(objgmef.nrogme).emit("los que adivinan",
                {usrexpl: pmrusr[0]});
io.to(pmrusr[1]).emit("el del turno",
                 {wrd: jue[objgmef.nrogme].wrdtogss});

//tiempo=20;
  //nota el tiempo de ese juego jue[objgmef.nrogme].tiempo
jue[objgmef.nrogme].tiempo=90;
jue[objgmef.nrogme].mod="ten";

  
  cuenta_abajo(objgmef.nrogme,jue[objgmef.nrogme].playertrn);

}//elseif nroplyact==nroply-1 : junta y comienza
else{
console.log("juego comenzado");
  
io.to(socket.id).emit("ya comenzo jue",
                 {msg:"complete game, create a new one"});

}//else, comenzado

}//else hay jue
    
});//skon entra juego
 
//los tiempos se manejan del lado del server.  
  
  
  
function cuenta_abajo(roomjf){

io.to(roomjf).emit("corre reloj",{tiempo:jue[roomjf].tiempo});
jue[roomjf].tiempo-= 1;
  
if(jue[roomjf].tiempo> 0){
    setTimeout(function(){
      cuenta_abajo(roomjf);},1000);
}//if
else if(jue[roomjf].mod=="ten"){
  
  io.to(roomjf).emit("no se adivino",
                  {wrdtogss: jue[roomjf].wrdtogss});
  
  jue[roomjf].tiempo= 10;
  jue[roomjf].mod="turn";
    
  cuenta_abajo(roomjf);
}//else if ten
else if(jue[roomjf].mod=="turn"){
  
  console.log("new turn?");
  console.log(Object.keys(jue[roomjf].nroplyact));
  var winner="";
for(var i=0;i<Object.keys( jue[roomjf].nroplyact).length;i++){

 if(jue[roomjf].nroplyact[
Object.keys(jue[roomjf].nroplyact)[i]
][2]>= 10){

 winner=jue[roomjf].nroplyact[
Object.keys(jue[roomjf].nroplyact)[i]
][0];
  console.log("ganó");
console.log(winner);
break;
}//if 10
}//for
  

if(winner==""){
  
  jue[roomjf].playertrn++;
  jue[roomjf].tiempo= 90;
  jue[roomjf].mod="ten";
  
  var pmrid= Object.keys(jue[roomjf].nroplyact)[ jue[roomjf].playertrn% Object.keys(jue[roomjf].nroplyact).length ];
  
var pmrusr= jue[roomjf].nroplyact[pmrid];//[fn,sktid]
  

jue[roomjf].wrdtogss= jue[roomjf].listwrd[dar_aleatoriapos(0,jue[roomjf].listwrd.length)];  

  if(Object.keys(jue[roomjf].nroplyact).length>1){
  
io.to(roomjf).emit("los que adivinan",
                {usrexpl: pmrusr[0]});
io.to(pmrusr[1]).emit("el del turno",
                      {wrd: jue[roomjf].wrdtogss});
  
  
    cuenta_abajo(roomjf); 
  }//if cantply>1
}//if no winner
else{
  io.to(roomjf).emit("quien gano",
                   {wnrnme:winner});
}//else, quien gano
   
  
}//else if next
else{
    console.log("else");
  
}//else

}//count down


  
function dar_aleatoriapos(a,b){
    return Math.floor(Math.random() * b) + a;
};//random number entre 0 y m.length
  
  
  
socket.on("10 seg",function(objnrogmef){
  //objnrogmef{nrogme}
  console.log("10 seg next turn");
  console.log(jue[objnrogmef.nrogme].tiempo);
  jue[objnrogmef.nrogme].tiempo=10;
  jue[objnrogmef.nrogme].mod="turn";
 //next turn
});//10 seg para next turn player    
  
  


  
  
socket.on('send messagejue',function(objmsggmef){
  //objmsggmef{msg,nrogme}
  
  var pmrid= Object.keys(jue[objmsggmef.nrogme].nroplyact)[ jue[objmsggmef.nrogme].playertrn% Object.keys(jue[objmsggmef.nrogme].nroplyact).length ];

  var sktidply= jue[objmsggmef.nrogme].nroplyact[pmrid][1];//[fn,sktid]
  
  var smejug=sktidply==socket.id;//same jugador ?
  var re=new RegExp(jue[objmsggmef.nrogme].wrdtogss,"i");
  
  if(re.test(objmsggmef.msg)&&
     jue[objmsggmef.nrogme].mod=="ten"&&
     !(smejug)){
    var gss=true;
    
  }//if
  
  
  objmsggmef.msg= emoji.emojify(objmsggmef.msg);
  objmsggmef.msg= haber_link(objmsggmef.msg);
  
   io.to(objmsggmef.nrogme).emit('new messagejue',
                   {msg:objmsggmef.msg,
                    nrogme:objmsggmef.nrogme,
                    nick:socket.request.user.firstnm,
                    guess:gss});
  
  if(gss){
    var usrid= socket.request.user._id;
jue[objmsggmef.nrogme].nroplyact[usrid][2]+=1;
//puntaje
    console.log("punteo");
    console.log(jue[objmsggmef.nrogme].nroplyact);
var pntply= jue[objmsggmef.nrogme].nroplyact[usrid][2];
    
  io.to(objmsggmef.nrogme).emit("actualiza puntaje",
              {usrid: usrid,
               pntply: pntply});  
    
  }//if adivina, suma 1
  
});//sk send msg juego
  
   

socket.on("salir del juego",function(objroomjf){
  //objroomjf{room}
  console.log("sale del jue"),
 
  socket.leave(objroomjf.room);

  var usrid= socket.request.user._id;
  
  if(!socket.id) return;
  
  if(jue[objroomjf.room]){
  delete jue[objroomjf.room].nroplyact[usrid];//eliminar
  
  var nroplyact= jue[objroomjf.room].nroplyact;
  var nroingme= Object.keys(jue[objroomjf.room].nroplyact).length;
  }//if objroomjf.room
  

  if(nroingme==0){//elimina bar
    io.sockets.emit("eliminar gmebar",
                 {rmgme:objroomjf.room});
  }else{
    
    io.sockets.emit("manda user al juego",
                  {usersjue: nroplyact,
                   nrogme: objroomjf.room});
}//else manda user al juego
    
});//skon salir del juego
  
  
  
  
socket.on('disconnect', function() {
//console.log(socket.request.user);
  
  io.to(socket.id).emit("se desconecto",
                        {msg:"desconexión o cerro"});
  
  if(!socket.id) return;
  delete userscnnt[socket.request.user._id];
  io.sockets.emit('usernames', userscnnt);
  
  console.log("se desconecto "+ socket.request.user.firstnm);
  
  for(var rm in usersroom){
 if(usersroom[rm][socket.request.user._id]){
   if(!socket.id) return;
 delete usersroom[rm][socket.request.user._id];
io.to(rm).emit('manda users al room',
        {usersroom:usersroom[rm],
         room:rm});
io.sockets.emit("actualizar rooms",
                {usersroom:usersroom[rm],
                 room:rm});   
}//if
}//for
   
  /* del control total de usuarios, eliminarlo
   delete usersjue[socket.request.user._id];
  io.sockets.emit("manda user al juego",usersjue);*/
});//skon disconnect
  
  
  
  
});//skcn socket connection


// listen for requests :)
/*var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/


//link catcher
function haber_link(tf){
var re=/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

var mctch=tf.match(re);

if(mctch){
var lc= mctch[0];

var tm= tf.replace(lc,taggear_a(lc))

return tm;
}else{
return tf;
}//else

function taggear_a(lf){
    var a='<a href="'+lf+'" target="_blank">'+
            lf+'</a>';
    return a;        
}//taggear_a
}//haber_link
