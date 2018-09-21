//fecha: 16-09-18, 19-09, 20-09
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
//userscnnt{userid:{user,sktid}}

var usersroom={};
//usersroom{roomf:{useridf:firstnm}}

var userssecretroom={};
var usersjue={};
//usersjue{sktid:{firstnm,sktid},...}

//user{_id,email,firstnm,lastnm,chats[]}

//juego
var jue={};
/*
jue{juenro:{nrogame,tiempo,wordtoguess,typegame,
  listwordnm,listword,playertrn,nroplayer,nroplayeract},...}
*/
  
var listwords= require("./wordlists.js");



//socket connection, poner variable afuera
io.sockets.on('connection', function(socket) {
  
  
 console.log("en conexion "+ socket.request.user.firstnm);

 console.log("lanza barras de juego");
  
 for(var juex in jue){
  if(Object.keys(jue[juex].nroplayeract).length!=0){
 
   io.sockets.emit("los demas barjue",
                 {nrogame: juex,
                  typegame: jue[juex].typegame,
                  listwordnm: jue[juex].listwordnm,
                  nroplayer: jue[juex].nroplayer});

  }//if hay jugadores
 }//for
  
//----click on chat
  
socket.on("user va a chat",function(){

 console.log("entro a chat "+ socket.request.user.firstnm);
 
 if(socket.request.user){

  userscnnt[socket.request.user._id]= {user: socket.request.user,
            sktid:socket.id};

  io.sockets.emit('usernames', userscnnt);


  for( var room in usersroom){
    io.to(socket.id).emit("actualizar rooms",
           {usersroom: usersroom[room],
            room:room});

  }//for actualiza, cuando entra   
   
 }//if user lgged
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
                     chatroom:chatf.chats[roomf],
                     sktid:socket.id,
                     room:roomf});
      io.sockets.emit("actualizar rooms",
                      {usersroom:usersroom[roomf],
                       chatroom:chatf.chats[roomf],
                       sktid:socket.id,
                       room:roomf});

    });//save
  
  });//findone
  
  /* creado nuevo objeto, para chats prv, otro para reportes
  
  //_id chatsprv 5a36957e2659be546185f785
  //_id reportes 5a3694ecfe052c4f9add75ff
  var newChat=new Chat();
  newChat.chatsprv= {};
  newChat.save(function(err){
  if(err) throw err;
  });//save
*/
      
});//skon abre general
  
  
  
socket.on('send message room', function(objmsgf) {
    //objmsgf{msg(inimsgval),room,typeroom}
  console.log("enviar msg a room: "+objmsgf.typeroom)
  objmsgf.msg= emoji.emojify(objmsgf.msg);
  objmsgf.msg= haber_link(objmsgf.msg);
  
  
  if(objmsgf.typeroom==="public"){

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
  }//if typeroom public
    
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
  
socket.on("slide in secret",function(roomsecretf){
 //roomsecretf=secret name's room
  console.log("slide in: "+roomsecretf)
  
  if(!usersroom[roomsecretf]){
   usersroom[roomsecretf]={};
  }//if indef
  //console.log(usersroom[roomsecretf])
  usersroom[roomsecretf][socket.request.user._id]= socket.request.user.firstnm;

  socket.join(roomsecretf);
  console.log(io.sockets.adapter.rooms[roomsecretf]);

  io.to(roomsecretf).emit('manda users a secretroom',
             {usersroom:usersroom[roomsecretf],
              sktid:socket.id,
              room:roomsecretf});

});//skon slide in secret room
          
 

socket.on("ver su profile",function(objuserf){
   //objuserf{useridrcv,sktidrcv,sktidmnd}
  console.log("ver su perfil");
  console.log(objuserf); 
  var user={}; 
 
  User.findOne({_id:objuserf.useridrcv},
               (err,user)=>{
      //console.log(user);
    user.firstnm=user.firstnm;
    user.lastnm=user.lastnm;
    user.avatar=user.avatar;
    user.age=user.age;
    user.gender=user.gender;
    user.country=user.country;
    user.speaks=user.speaks;
    user.learning=user.learning;
    user.aboutme=user.aboutme;
      io.to(objuserf.sktidmnd).emit("perfil a ver",
          {user:user,
           useridrcv:objuserf.useridrcv,
           sktidrcv:objuserf.sktidrcv});
  });//findone  
  
});//skon ver su profile
  
  
  
//==== 2c.. private chats
  
socket.on("manda chatrequest",function(objuserf){
  //objuserf{sktidrcv,useridrcv,sktidmnd}
  console.log("2hizo chatrequest");
  console.log(objuserf);
  var idmnd=socket.request.user._id;
  
  var useridrcv=objuserf.useridrcv;
  
  var roombth=idmnd> useridrcv?
         idmnd+"_"+useridrcv:
         useridrcv+"_"+idmnd;
  
  if(!usersroom[roombth]){
   usersroom[roombth]={};
  }//if indef
  //usersroom{roomnme{userid:firstnm,...},...}
  usersroom[roombth][socket.request.user._id]= socket.request.user.firstnm;
  
  socket.join(roombth);
   
  console.log(io.sockets.adapter.rooms[roombth]); 
  
  io.to(objuserf.sktidrcv).emit("recibe chatrequest",
          {nmemnd:socket.request.user.firstnm,
           sktidmnd:objuserf.sktidmnd,
           sktidrcv:objuserf.sktidrcv,
           roombth:roombth
          }); //sktcltid de quien la manda
    
  if(userscnnt[useridrcv])
    var nmercv= userscnnt[useridrcv].user.firstnm;
  
  io.to(roombth).emit("espera chatrequest",
          {sktidmnd:objuserf.sktcltid,
           sktidrcv:objuserf.sktidrcv,
           nmercv:nmercv,
           roombth:roombth});
    
});//skon hicieron request
 
  
  
socket.on("cancel chatrequest",function(objuserf){
 //objuserf{sktidrcv,roombth}
 console.log("cancelo chat request")
 //y sacarlo del room

 socket.to(objuserf.sktidrcv).emit("eliminar chatrequest",
    {roombth:objuserf.roombth});
});//skon cancel request
  
  
  
  
socket.on("abrir chatrequest",function(objuserf){
 //objuserf{roombth,sktidmnd}

  console.log("4abre chatrequest");

  usersroom[objuserf.roombth][socket.request.user._id]= socket.request.user.firstnm;

  socket.join(objuserf.roombth);
    
  console.log(io.sockets.adapter.rooms[objuserf.roombth]);
  var nmercv=socket.request.user.firstnm;
   
  var useridmnd="";

  for(var useri in userscnnt){
    if(userscnnt[useri].sktid== objuserf.sktidmnd){
      useridmnd=useri;
      break;
    }//if
  }//for
   
  if(userscnnt[useridmnd]) 
    var nmemnd=userscnnt[useridmnd].user.firstnm;
   
  io.to(objuserf.sktidmnd).emit("acepta chatrequest",
            {nmercv:nmercv,nmemnd:nmemnd,
             sktidrcv:objuserf.sktidrcv,
             sktidmnd:objuserf.sktidmn,
             roombth:objuserf.roombth});
});//skon abrir chatrequest
  
  
  
socket.on("users al chatrequest",function(objuserf){
 //objuserf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("6users para chatrequest");
  
  //buscar 30 lines chat historial aqui !!!
  var id12= objuserf.roombth.split("_");
  
  var chatprv;
  
  Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,chatf){
    
   
    if(!chatf.chatsprv){
      chatf.chatsprv={};
    }//if no chatsprv, crear
    
    
    if(!chatf.chatsprv[objuserf.roombth]){

      chatf.chatsprv[objuserf.roombth]=[];
    }//if no existe, crea
    
    chatf.markModified("chatsprv."+objuserf.roombth);
    
    chatprv=chatf.chatsprv[objuserf.roombth]; 
    
    chatf.save((err)=>{
      if(err) throw err;  
  
      objuserf["chatprv"]=chatprv;
      io.to(objuserf.roombth).emit("mete users en chatrequest", objuserf);

    });//save
  });//findone
 
});//skon users pa chat request
  
  
  
socket.on("send messagechat_r",function(objmsgf){
    //objmsgf{msg,roombth}
  console.log("envio messagechat_r")
  var id12= objmsgf.roombth.split("_");
 
  objmsgf.msg= emoji.emojify(objmsgf.msg);
  objmsgf.msg= haber_link(objmsgf.msg);
  
  
  Chat.findOne({_id:"5a36957e2659be546185f785"},
             function(err,chatf){
    
    var consav=socket.request.user.firstnm+": "+objmsgf.msg;

    if(chatf.chatsprv[objmsgf.roombth].length<15){
      chatf.chatsprv[objmsgf.roombth].push(consav);
    }else{
      chatf.chatsprv[objmsgf.roombth].shift();
      chatf.chatsprv[objmsgf.roombth].push(consav);
    }//else shift and push    

    chatf.markModified("chatsprv."+objmsgf.roombth); 
       
    chatf.save((err)=>{
     if(err) throw err;
    });//save  
  });//findone  
  
  
  io.to(objmsgf.roombth).emit("new msgchatrequest",
             {msg:objmsgf.msg,
              nick:socket.request.user.firstnm,
              room:objmsgf.roombth});
});//skon send message chat rquest
  

  
socket.on("solicitar llamada",function(objroomcallf){
  //objroomcallf{roomrtc:roombth}
  console.log("solicita llamada");
  io.to(objroomcallf.roomrtc).emit("solicitud de aceptacion de la llamada",
      {roomrtc:objroomcallf.roomrtc, sktidmnd:socket.id,
       nmemnd: socket.request.user.firstnm});
  
});//skon solicitar llamada  
  
 
  
socket.on("cancelar llamada entrante", function(objroomcallf){
  //objroomcallf{roomrtc}
  console.log("cancelar llamada entrante de: "+objroomcallf.roomrtc)
  io.to(objroomcallf.roomrtc).emit("se cancelo llamada",
                    {roomrtc:objroomcallf.roomrtc});
});//skon cancelar llamada entr  
  

  
socket.on("correr llamada",function(objroomcallf){
  //objroomcallf{roomrtc}
  console.log("correr llamada en: "+objroomcallf.roomrtc)
  io.to(objroomcallf.roomrtc).emit("correr webrtc",
                      {roomrtc:objroomcallf.roomrtc});
});//skon correr llamada  
  
 
socket.on("colgar llamada",function(objroomcallf){
  //objroomcallf{roomrtc}
  console.log("colgar llamada en: "+objroomcallf.roomrtc)
  io.to(objroomcallf.roomrtc).emit("se cuelga llamada",
                   {roomrtc:objroomcallf.roomrtc});
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
  
  
socket.on("solicitar game",function(objgamef){
  //objgamef{typegame,listword,nroplayer}

  console.log("2solicitar juego");
  console.log(objgamef);

  var nrogame= "jue"+Object.keys(jue).length;  


  jue[nrogame]= {nrogame: nrogame,
                tiempo:0,
                mod:"",
                wordtoguess:"",
                typegame: objgamef.typegame,
                listwordnm:objgamef.listword,
                listword: listwords[objgamef.listword],
                playertrn:"", 
                nroplayer: objgamef.nroplayer,
                nroplayeract: {}
               };//jue{}

  io.to(socket.id).emit("crear juego",
                 {nrogame: nrogame,
                  typegame: objgamef.typegame,
                  listword: objgamef.listword,
                  nroplayer: objgamef.nroplayer });
  //socket.broadcast.emit("los demas barjue",
  io.sockets.emit("los demas barjue",
                  {nrogame:nrogame,
                   typegame:objgamef.typegame,
                   listwordnm:objgamef.listword,
                   nroplayer:objgamef.nroplayer});
  
});//skon solicitar game  
  
  
socket.on('entrar roomj',function(objgamef){
 //objgamef{nrogame,typegame,listword,nroplayer}
  console.log("3entrando al juego");
  console.log(objgamef);
    
  var userid= socket.request.user._id;
  var fn=  socket.request.user.firstnm;

  if(!jue[objgamef.nrogame]){
    
    console.log("no hay "+objgamef.nrogame);
    io.sockets.emit("eliminar gamebar",
                 {roomgame:objgamef.nrogame});
    
  }else{//else hay jue
    
    var nroingame= Object.keys(jue[objgamef.nrogame].nroplayeract).length;
  
  
    if(nroingame< (jue[objgamef.nrogame].nroplayer-1) ){
      console.log("cant menor que nroplayer-1");

      jue[objgamef.nrogame].nroplayeract[userid]=[fn,socket.id,0];
      //[fn,sktid,puntaje]

      console.log(typeof jue[objgamef.nrogame]);

      socket.join(objgamef.nrogame);
      usersjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
                 sktid:socket.id};
  
      var usergame= jue[objgamef.nrogame].nroplayeract; 

      io.to(objgamef.nrogame).emit("manda user al juego",
                           {usersjue:usergame,
                            nrogame:objgamef.nrogame,
                            typegame:objgamef.typegame,
                            listword:objgamef.listword,
                            nroplayer:objgamef.nroplayer});

    }//if nroplayeract<nroplayer-1: junta

    else if(nroingame== (jue[objgamef.nrogame].nroplayer-1) ){
      console.log("cant igual que nroplayer-1")

      jue[objgamef.nrogame].nroplayeract[userid]=[fn,socket.id,0];
        //[fn,sktid,puntaje]


      socket.join(objgamef.nrogame);

      //decir que roomgame, para luego eliminarlo en disconnect
      usersjue[socket.request.user._id]= {firstnm:socket.request.user.firstnm,
                 sktid:socket.id};
  
      var usergame= jue[objgamef.nrogame].nroplayeract; 

      io.to(objgamef.nrogame).emit("manda user al juego",
                           {usersjue:usergame,
                            nrogame:objgamef.nrogame,
                            typegame:objgamef.typegame,
                            listword:objgamef.listword,
                            nroplayer:objgamef.nroplayer});

      //strgame(jue[objgamef.nrogame]);
      //start playerer 0 va sumando 0%nroplayer
      var playertrn= 0;
      jue[objgamef.nrogame].playertrn= 0;

      var pmrid= Object.keys(jue[objgamef.nrogame].nroplayeract)[playertrn];
      var pmruser= jue[objgamef.nrogame].nroplayeract[pmrid];//[fn,sktid]

      jue[objgamef.nrogame].wordtoguess= jue[objgamef.nrogame].listword[dar_aleatoriapos(0, jue[objgamef.nrogame].listword.length)];  

      io.to(objgamef.nrogame).emit("los que adivinan",
                      {userexpl: pmruser[0]});
      io.to(pmruser[1]).emit("el del turno",
                       {word: jue[objgamef.nrogame].wordtoguess});

      //tiempo=20;
        //nota el tiempo de ese juego jue[objgamef.nrogame].tiempo
      jue[objgamef.nrogame].tiempo=90;
      jue[objgamef.nrogame].mod="ten";


      cuenta_abajo(objgamef.nrogame,jue[objgamef.nrogame].playertrn);

    }//elseif nroplayeract==nroplayer-1 : junta y comienza
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
                    {wordtoguess: jue[roomjf].wordtoguess});

    jue[roomjf].tiempo= 10;
    jue[roomjf].mod="turn";

    cuenta_abajo(roomjf);
  }//else if ten
  else if(jue[roomjf].mod=="turn"){
  
    console.log("new turn?");
    console.log(Object.keys(jue[roomjf].nroplayeract));
    var winner="";

    for(var i=0;i<Object.keys( jue[roomjf].nroplayeract).length;i++){

     if(jue[roomjf].nroplayeract[
          Object.keys(jue[roomjf].nroplayeract)[i]
         ][2]>= 10){

      winner=jue[roomjf].nroplayeract[
         Object.keys(jue[roomjf].nroplayeract)[i]
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

      var pmrid= Object.keys(jue[roomjf].nroplayeract)[ jue[roomjf].playertrn% Object.keys(jue[roomjf].nroplayeract).length ];

      var pmruser= jue[roomjf].nroplayeract[pmrid];//[fn,sktid]
  

      jue[roomjf].wordtoguess= jue[roomjf].listword[dar_aleatoriapos(0,jue[roomjf].listword.length)];  

      if(Object.keys(jue[roomjf].nroplayeract).length>1){
  
        io.to(roomjf).emit("los que adivinan",
                        {userexpl: pmruser[0]});
        io.to(pmruser[1]).emit("el del turno",
                              {word: jue[roomjf].wordtoguess});

  
        cuenta_abajo(roomjf); 
      }//if cantplayer>1
    }//if no winner
    else{
      io.to(roomjf).emit("quien gano",
                   {winnernme:winner});
    }//else, quien gano
  
  }//else if next
  else{
    console.log("else");  
  }//else

}//count down


  
function dar_aleatoriapos(a,b){
  return Math.floor(Math.random() * b) + a;
};//random number entre 0 y m.length
  
  
  
socket.on("10 seg",function(objnrogamef){
  //objnrogamef{nrogame}
  console.log("10 seg next turn");
  console.log(jue[objnrogamef.nrogame].tiempo);
  jue[objnrogamef.nrogame].tiempo=10;
  jue[objnrogamef.nrogame].mod="turn";
 //next turn
});//10 seg para next turn player    
  
  


  
  
socket.on('send messagejue',function(objmsggamef){
  //objmsggamef{msg,nrogame}
  console.log("enviar msgjue: "+objmsggamef)
  var pmrid= Object.keys(jue[objmsggamef.nrogame].nroplayeract)[ jue[objmsggamef.nrogame].playertrn% Object.keys(jue[objmsggamef.nrogame].nroplayeract).length ];

  var sktidplayer= jue[objmsggamef.nrogame].nroplayeract[pmrid][1];//[fn,sktid]
  
  var smejug=sktidplayer==socket.id;//same jugador ?
  var re=new RegExp(jue[objmsggamef.nrogame].wordtoguess,"i");
  
  if(re.test(objmsggamef.msg)&&
     jue[objmsggamef.nrogame].mod=="ten"&&
     !(smejug)){
    var guess=true;
    
  }//if
  
  
  objmsggamef.msg= emoji.emojify(objmsggamef.msg);
  objmsggamef.msg= haber_link(objmsggamef.msg);
  
  io.to(objmsggamef.nrogame).emit('new messagejue',
                   {msg:objmsggamef.msg,
                    nrogame:objmsggamef.nrogame,
                    nick:socket.request.user.firstnm,
                    guess:guess});
  
  if(guess){
    var userid= socket.request.user._id;
    jue[objmsggamef.nrogame].nroplayeract[userid][2]+=1;
    //puntaje
    console.log("punteo");
    console.log(jue[objmsggamef.nrogame].nroplayeract);
    var pntplayer= jue[objmsggamef.nrogame].nroplayeract[userid][2];
    
    io.to(objmsggamef.nrogame).emit("actualiza puntaje",
                {userid: userid,
                 pntplayer: pntplayer});  
    
  }//if adivina, suma 1
  
});//sk send msg juego
  
   

socket.on("salir del juego",function(objroomjf){
  //objroomjf{room}
  console.log("sale del jue: "+objroomjf),
 
  socket.leave(objroomjf.room);

  var userid= socket.request.user._id;
  
  if(!socket.id) return;
  
  if(jue[objroomjf.room]){
    delete jue[objroomjf.room].nroplayeract[userid];//eliminar
  
    var nroplayeract= jue[objroomjf.room].nroplayeract;
    var nroingame= Object.keys(jue[objroomjf.room].nroplayeract).length;
  }//if objroomjf.room
  

  if(nroingame==0){//elimina bar
    io.sockets.emit("eliminar gamebar",
                 {roomgame:objroomjf.room});
  }else{
    
    io.sockets.emit("manda user al juego",
                  {usersjue: nroplayeract,
                   nrogame: objroomjf.room});
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
  
  for(var room in usersroom){
    if(usersroom[room][socket.request.user._id]){
       if(!socket.id) return;
       delete usersroom[room][socket.request.user._id];
       io.to(room).emit('manda users al room',
                {usersroom:usersroom[room],
                 room:room});
       io.sockets.emit("actualizar rooms",
                        {usersroom:usersroom[room],
                         room:room});   
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
