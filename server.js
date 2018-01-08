
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
var ndmlr= require('nodemailer');
var pssp= require('passport');
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


var usrscnnt={};
//usrscnnt{usrid:{user,sktid}}

var usrsroom={};
//usrsroom{rmf:{usridf:firstnm}}

var usrssctrm={};
var usrjue={};

//user{_id,email,firstnm,lastnm,chats[]}

//juego
var jue={};

  
var liswrds= require("./wordlists.js");



//socket connection, poner variable afuera
io.sockets.on('connection', function(socket) {
  
  console.log("en conexion "+ socket.request.user.firstnm);

  
  
//----click on chat
  
socket.on("userva",function(dt){
//dt
  console.log("entro a chat "+ socket.request.user.firstnm);
 if(socket.request.user){

usrscnnt[socket.request.user._id]= {user: socket.request.user,
          sktid:socket.id};

io.sockets.emit('usernames', usrscnnt);

 
for( var rm in usrsroom){
io.to(socket.id).emit("actlz rooms",
  {usrsroom: usrsroom[rm],
   room:rm});
  
}//for actualiza, cuando entra   
   
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
  
  
  
socket.on('send message room', function(dt) {
    //dt{msg(inimsgval),room,typrm}
    
  dt.msg=emoji.emojify(dt.msg);
   
  if(dt.typrm==="public"){
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
  }//if typrm public
    
   io.to(dt.room).emit('new message room',
              {msg:dt.msg,
          nick:socket.request.user.firstnm,
              room:dt.room});
});//skon send msg


  
socket.on("cerr room",function(dt){
  //dt="roombth o gnrl" room
console.log("cerr room "+dt);
  
socket.leave(dt);
  
  if(!socket.id) return;
  
  //console.log(usrsroom[dt]);
  if(usrsroom[dt])
  delete usrsroom[dt][socket.request.user._id];
  io.to(dt).emit('mndusrroom',
                {usrsroom:usrsroom[dt],
                 room:dt});
  /*
  io.to(socket.id).emit('mndusrroom',
                {usrsroom:usrsroom[dt],
                 room:dt});*/
  io.sockets.emit("actlz rooms",
                {usrsroom:usrsroom[dt],
                 room:dt});

  /*else{
 
  socket.leave(dt);
 //corregir room privados !!!
  io.to(dt).emit("dejar prv",dt); 
}//else el prv   */  
});//skon cerrar room  
  
  
  
socket.on("typing",function(dt){
  //dt{room}
  
  socket.to(dt.room).broadcast.emit("who type",
                  {firstnm: socket.request.user.firstnm,
                     room:dt.room});
  
});//typing
  
  
  
 socket.on("reporte",function(dt){
//dt{tit,rpt}
console.log("guarda reporte");
Chat.findOne({_id:"5a3694ecfe052c4f9add75ff"},
              function(err,cht){

cht.reportes.push(
     [socket.request.user._id,
      socket.request.user.firstnm,
       dt]);

cht.save((err)=>{
 if(err) throw err;
});//save
});//findone

});//reporte 
  
  
//=====secret rooms
  
socket.on("slide in sct",function(dt){
 //dt=secret name's room
 
 if(!usrsroom[dt]){
   usrsroom[dt]={};
}//if indef
  //console.log(usrsroom[dt])
  usrsroom[dt][socket.request.user._id]= socket.request.user.firstnm;

socket.join(dt);
  console.log(io.sockets.adapter.rooms[dt]);

io.to(dt).emit('mndusrroom',
             {usrsroom:usrsroom[dt],
              sktid:socket.id,
              room:dt});

});//skon slide in secret room
          
  
  
//====private chats
  
socket.on("mnd chtrqs",function(dt){
  //dt{sktidrcv,usridrcv,sktidmnd}
  console.log("2hizo cht rqst");
  console.log(dt);
  var idmnd=socket.request.user._id;
  
  var usridrcv=dt.usridrcv;
  
  var roombth=idmnd> usridrcv?
         idmnd+"_"+usridrcv:
         usridrcv+"_"+idmnd;
  
  if(!usrsroom[roombth]){
   usrsroom[roombth]={};
}//if indef
  //usrsroom{rmnme{usrid:firstnm,...},...}
  usrsroom[roombth][socket.request.user._id]= socket.request.user.firstnm;
  
  socket.join(roombth);
   
 console.log(io.sockets.adapter.rooms[roombth]); 
  
  socket.to(dt.sktidrcv).emit("recibe chtrqs",
        {nmemnd:socket.request.user.firstnm,
       sktidmnd:dt.sktidmnd,
     sktidrcv:dt.sktidrcv,
           roombth:roombth
         }); //sktcltid de quien la manda
    
  if(usrscnnt[usridrcv])
  var nmercv= usrscnnt[usridrcv].user.firstnm;
  
    io.to(roombth).emit("espera chtrqs",
          {sktidmnd:dt.sktcltid,
           sktidrcv:dt.sktidrcv,
  nmercv:nmercv,
           roombth:roombth});
    
  });//skon hicieron request
 
  
  
  socket.on("cancel chtrqs",function(dt){
 //dt{sktidrcv,rmbth}

//y sacarlo del room

 socket.to(dt.sktidrcv).emit("elim chtrqs",
    {rmbth:dt.rmbth});
});//skon cancel request
  
  
  
  
  socket.on("abr chtrqs",function(dt){
   //dt{roombth,sktidmnd}
    
    console.log("4abr chtrqs");
    
    usrsroom[dt.roombth][socket.request.user._id]= socket.request.user.firstnm;
    
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
   
   if(usrscnnt[usridmnd]) 
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
  
  Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,cht){
    
   
    if(!cht.chtsprv){
      cht.chtsprv={};
    }//if no chtsprv, crear
    
    
if(!cht.chtsprv[dt.roombth]){
      
cht.chtsprv[dt.roombth]=[];
}//if no existe, crea
    
   cht.markModified("chtsprv."+dt.roombth);
    
   chtprv=cht.chtsprv[dt.roombth]; 
    
  cht.save((err)=>{
 if(err) throw err;  
  
    
    dt["chtprv"]=chtprv;
    io.to(dt.roombth).emit("mete usrs chtrqs", dt);
    
    
  });//save
});//findone
  
 
});//skon users pa chat request
  
  
  
socket.on("send messagecht_r",function(dt){
    //dt{msg,roombth}
  
  var id12=dt.roombth.split("_");
 
  dt.msg=emoji.emojify(dt.msg);
  
  
Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,cht){
    
var consav=socket.request.user.firstnm+": "+dt.msg;
if(cht.chtsprv[dt.roombth].length<15){
 cht.chtsprv[dt.roombth].push(consav);
}else{
cht.chtsprv[dt.roombth].shift();
cht.chtsprv[dt.roombth].push(consav);
}//else shift and push    
    
cht.markModified("chtsprv."+dt.roombth);    
cht.save((err)=>{
 if(err) throw err;
});//save  
});//findone  
  
  
  io.to(dt.roombth).emit("new msgchtrqs",
                        {msg:dt.msg,
        nick:socket.request.user.firstnm,
                    room:dt.roombth});
});//skon send message chat rquest
  

  
socket.on("solicitar llamada",function(dt){
 //dt{rmrtc:roombth}
console.log("solicita llamada");
 io.to(dt.rmrtc).emit("solicitud de aceptacion de la llamada",
  {rmrtc:dt.rmrtc, sktidmnd:socket.id,
   nmemnd: socket.request.user.firstnm});
  
});//skon solicitar llamada  
  
 
  
socket.on("cancelar llamada entrante", function(dt){
 //dt{rmrtc}
io.to(dt.rmrtc).emit("se cancelo llmd",
                    {rmrtc:dt.rmrtc});
});//skon cancelar llamada entr  
  

  
socket.on("correr llmd",function(dt){
 //dt{rmrtc}

io.to(dt.rmrtc).emit("correr webrtc",
                      {rmrtc:dt.rmrtc});
});//skon correr llmd  
  
 
socket.on("colgar llamada",function(dt){
 //dt{rmrtc}
io.to(dt.rmrtc).emit("se cuelga llmd",
                   {rmrtc:dt.rmrtc});
});//skon colgar llamada 
  
  
  
//guardar nota
socket.on("save note",function(dt){
//dt{nte}

User.findOne({_id: socket.request.user._id},
    function(err,usr){

if(!usr.notes){
 usr.notes="";
}

usr.notes=dt.nte;

usr.save((err)=>{
if(err) throw err;
});//save
});//findone
console.log("saved note");
});//skon save note  
  
  
  
  
//=====jueg  
  
  
socket.on("solicitar game",function(dt){
 //dt{typgme,liswrd,nroply}

console.log("2solicitar juego");
console.log(dt);
  
var nrogme= "jue"+Object.keys(jue).length;  

  
jue[nrogme]= {nrogme: nrogme,
              tmp:0,
              mod:"",
              wrdtogss:"",
             typegme: dt.typgme,
             liswrd: liswrds[dt.liswrd],
             plytrn:"", 
             nroply: dt.nroply,
             nroplyact: {}
             };//jue{}

io.to(socket.id).emit("crear juego",
             {nrogme: nrogme,
              typegme: dt.typgme,
             liswrd: dt.liswrd,
             nroply: dt.nroply });
//socket.broadcast.emit("los demas barjue",
io.sockets.emit("los demas barjue",
                {nrogme:nrogme,
                 typgme:dt.typgme,
                 liswrd:dt.liswrd,
                 nroply:dt.nroply});
  
});//skon solicitar game  
  
  
socket.on('entroomj',function(dt){
 //dt{nrogme,typgme,liswrd,nroply}
  console.log("3entrando al juego");
 console.log(dt);
    
var usrid= socket.request.user._id;
var fn=  socket.request.user.firstnm;

  if(!jue[dt.nrogme]){
    
    console.log("no hay "+dt.nrogme);
    io.sockets.emit("elim gmebar",
                 {rmgme:dt.nrogme});
    
    }else{//else hay jue
    
var nroingme= Object.keys(jue[dt.nrogme].nroplyact).length;
  
  
if(nroingme< (jue[dt.nrogme].nroply-1) ){
  console.log("cant menor que nroply-1");

  jue[dt.nrogme].nroplyact[usrid]=[fn,socket.id,0];
  //[fn,sktid,puntaje]
  
  console.log(typeof jue[dt.nrogme]);

socket.join(dt.nrogme);
usrjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
           sktid:socket.id};
  
 var usrgme= jue[dt.nrogme].nroplyact; 
io.to(dt.nrogme).emit("mndusrjue",
                     {usrjue:usrgme,
                      nrogme:dt.nrogme,
                      typgme:dt.typgme,
                      liswrd:dt.liswrd,
                      nroply:dt.nroply});

}//if nroplyact<nroply-1: junta

else if(nroingme== (jue[dt.nrogme].nroply-1) ){
  console.log("cant igual que nroply-1")

jue[dt.nrogme].nroplyact[usrid]=[fn,socket.id,0];
  //[fn,sktid,puntaje]
  
  
socket.join(dt.nrogme);
  
//decir que rmgme, para luego eliminarlo en disconnect
usrjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
           sktid:socket.id};
  
 var usrgme= jue[dt.nrogme].nroplyact; 
io.to(dt.nrogme).emit("mndusrjue",
                     {usrjue:usrgme,
                      nrogme:dt.nrogme,
                      typgme:dt.typgme,
                      liswrd:dt.liswrd,
                      nroply:dt.nroply});

//strgme(jue[dt.nrogme]);
  //start plyer 0 va sumando 0%nroply
var plytrn=0;
jue[dt.nrogme].plytrn=0;
  
var pmrid= Object.keys(jue[dt.nrogme].nroplyact)[plytrn];
var pmrusr= jue[dt.nrogme].nroplyact[pmrid];//[fn,sktid]

jue[dt.nrogme].wrdtogss= jue[dt.nrogme].liswrd[rndnuM(0, jue[dt.nrogme].liswrd.length)];  
    
io.to(dt.nrogme).emit("los que adivinan",
                {usrexpl: pmrusr[0]});
io.to(pmrusr[1]).emit("el del turno",
                 {wrd: jue[dt.nrogme].wrdtogss});

//tmp=20;
  //nota el tiempo de ese juego jue[dt.nrogme].tmp
jue[dt.nrogme].tmp=90;
jue[dt.nrogme].mod="ten";

  
  cntdwN(dt.nrogme,jue[dt.nrogme].plytrn);

}//elseif nroplyact==nroply-1 : junta y comienza
else{
console.log("juego comenzado");
  
io.to(socket.id).emit("ya comenzo jue",
                 {msg:"complete game, create a new one"});

}//else, comenzado

}//else hay jue
    
});//skon entra juego
 
//los tiempos se manejan del lado del server.  
  
  
  
function cntdwN(rmjf){

io.to(rmjf).emit("corre reloj",{tmp:jue[rmjf].tmp});
jue[rmjf].tmp-=1;
  
if(jue[rmjf].tmp>0){
    setTimeout(function(){
      cntdwN(rmjf);},1000);
}//if
else if(jue[rmjf].mod=="ten"){
  
  io.to(rmjf).emit("no se adivino",
                  {wrdtogss: jue[rmjf].wrdtogss});
  
  jue[rmjf].tmp=10;
  jue[rmjf].mod="turn";
    
  cntdwN(rmjf);
}//else if ten
else if(jue[rmjf].mod=="turn"){
  
  console.log("new turn?");
  console.log(Object.keys(jue[rmjf].nroplyact));
  var wnr="";
for(var i=0;i<Object.keys( jue[rmjf].nroplyact).length;i++){

 if(jue[rmjf].nroplyact[
Object.keys(jue[rmjf].nroplyact)[i]
][2]>= 10){

 wnr=jue[rmjf].nroplyact[
Object.keys(jue[rmjf].nroplyact)[i]
][0];
  console.log("ganó");
console.log(wnr);
break;
}//if 10
}//for
  

if(wnr==""){
  
  jue[rmjf].plytrn++;
  jue[rmjf].tmp=90;
  jue[rmjf].mod="ten";
  
  var pmrid= Object.keys(jue[rmjf].nroplyact)[ jue[rmjf].plytrn%jue[rmjf].nroply];
var pmrusr= jue[rmjf].nroplyact[pmrid];//[fn,sktid]

jue[rmjf].wrdtogss= jue[rmjf].liswrd[rndnuM(0,jue[rmjf].liswrd.length)];  

  if(Object.keys(jue[rmjf].nroplyact).length>1){
  
io.to(rmjf).emit("los que adivinan",
                {usrexpl: pmrusr[0]});
io.to(pmrusr[1]).emit("el del turno",
                      {wrd: jue[rmjf].wrdtogss});
  
  
    cntdwN(rmjf); 
  }//if cantply>1
}//if no wnr
else{
  io.to(rmjf).emit("quien gano",
                   {wnrnme:wnr});
}//else, quien gano
   
  
}//else if next
else{
    console.log("else");
  
}//else

}//count down
  
  
  
function rndnuM(a,b){
    return Math.floor(Math.random() * b) + a;
};//random number entre 0 y m.length
  
  
  
socket.on("10 seg",function(dt){
  //dt{nrogme}
  console.log("10 seg next turn");
 console.log(jue[dt.nrogme].tmp);
  jue[dt.nrogme].tmp=10;
  jue[dt.nrogme].mod="turn";
 //next turn
});//10 seg para next turn player    
  
  


  
  
socket.on('send messagejue',function(dt){
  //dt{msg,nrogme}
  
  var pmrid= Object.keys(jue[dt.nrogme].nroplyact)[ jue[dt.nrogme].plytrn%jue[dt.nrogme].nroply];

var sktidply= jue[dt.nrogme].nroplyact[pmrid][1];//[fn,sktid]
  
  var smejug=sktidply==socket.id;//same jugador ?
    var re=new RegExp(jue[dt.nrogme].wrdtogss,"i");
  
  if(re.test(dt.msg)&&
     jue[dt.nrogme].mod=="ten"&&
     !(smejug)){
    var gss=true;
    
  }//if
  
  
  dt.msg=emoji.emojify(dt.msg);
  
   io.to(dt.nrogme).emit('new messagejue',
                   {msg:dt.msg,
                    nrogme:dt.nrogme,
        nick:socket.request.user.firstnm,
                   guess:gss});
  
  if(gss){
    var usrid= socket.request.user._id;
jue[dt.nrogme].nroplyact[usrid][2]+=1;
//puntaje
    console.log("punteo");
    console.log(jue[dt.nrogme].nroplyact);
var pntply= jue[dt.nrogme].nroplyact[usrid][2];
    
  io.to(dt.nrogme).emit("actualiza puntaje",
              {usrid: usrid,
               pntply: pntply});  
    
  }//if adivina, suma 1
  
});//sk send msg juego
  
   

socket.on("slrjue",function(dt){
  //dt{room}
  console.log("sale del jue"),
 
  socket.leave(dt.room);

  var usrid= socket.request.user._id;
  
  if(!socket.id) return;
  
  if(jue[dt.room]){
  delete jue[dt.room].nroplyact[usrid];//eliminar
  
  var nroplyact= jue[dt.room].nroplyact;
  var nroingme= Object.keys(jue[dt.room].nroplyact).length;
  }//if dt.room
  

  if(nroingme==0){//elimina bar
    io.sockets.emit("elim gmebar",
                 {rmgme:dt.room});
  }else{
    
    io.sockets.emit("mndusrjue",
                  {usrjue: nroplyact,
                   nrogme: dt.room});
}//else mndusrjue
    
});//skon salir del juego
  
  
  
  
socket.on('disconnect', function(data) {
//console.log(socket.request.user);
  
  io.to(socket.id).emit("se desconecto",
                        {msg:"desconexión o cerro"});
  
  if(!socket.id) return;
  delete usrscnnt[socket.request.user._id];
  io.sockets.emit('usernames', usrscnnt);
  
  console.log("se desconecto "+ socket.request.user.firstnm);
  
  for(var rm in usrsroom){
 if(usrsroom[rm][socket.request.user._id]){
   if(!socket.id) return;
 delete usrsroom[rm][socket.request.user._id];
io.to(rm).emit('mndusrroom',
        {usrsroom:usrsroom[rm],
         room:rm});
io.sockets.emit("actlz rooms",
                {usrsroom:usrsroom[rm],
                 room:rm});   
}//if
}//for
   
  /* del control total de usuarios, eliminarlo
   delete usrjue[socket.request.user._id];
  io.sockets.emit("mndusrjue",usrjue);*/
});//skon disconnect
  
  
  
  
});//skcn socket connection


// listen for requests :)
/*var listener = Ap.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/
