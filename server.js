// 1.. 

require('dotenv').config();

var express = require('express');
var bd_parser= require("body-parser");
var app = express();
var server= require("http").createServer(app);
var io= require("socket.io").listen(server);
var passport_skio= require('passport.socketio');
var morgan= require('morgan');
var mongoose= require("mongoose");
var express_ejs_ly= require('express-ejs-layouts');
var flash= require('connect-flash');
var ck_parser= require('cookie-parser');
var expr_session= require('express-session');
var expr_validator= require('express-validator');
var mongo_cnnt= require('connect-mongo')(expr_session);
var nodemailer= require('nodemailer');
var passport= require('passport');
var emoji= require('node-emoji');

var port= process.env.PORT||80;//3000 y default 80
server.listen(port, process.env.IP);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {useMongoClient:true});
var session_str= new mongo_cnnt({mongooseConnection:mongoose.connection});


require('./config/passport')(passport);
app.use(express.static(__dirname+'/client')); //para activar angularjs
app.use(bd_parser.json());
app.use(bd_parser.urlencoded({extended:true}));
app.use(expr_validator());
app.use(ck_parser());
app.use(morgan('dev'));


app.set('view engine','ejs');//ejs html
app.use(express_ejs_ly);


app.use(expr_session({
secret:process.env.SECRET,
saveUninitialized:true,
resave:true,
store:session_str
}));


//passport.socketio
io.use(passport_skio.authorize({
key: 'connect.sid',
secret: process.env.SECRET,
store: session_str,
passport: passport,
cookieParser: ck_parser
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


var users_cnnt= {};
//users_cnnt{user_id:{user,skt_id}}
var users_5_no_cnnt= [];

var users_room= {};
//users_room{roomf:{user_idf:firstname}}

var users_secret_room= {};
var users_jue= {};
//users_jue{skt_id:{firstname,skt_id},...}

//user{_id,email,firstname,lastname,chats[]}

//juego
var jue= {};
/*
jue{jue_nro:{nro_game,tiempo,word_to_guess,type_game,
  list_word_name,list_word,player_trn,nro_player,nro_player_act},...}
*/
  
var list_words= require("./wordlists.js");

/*-----indice

.chat
.llamada
.nota
.play


*/

//socket connection, poner variable afuera
io.sockets.on('connection', function(socket)
{
console.log("en conexion "+ socket.request.user.firstname);
console.log("lanza barras de juego");
for(var juex in jue)
{
if(Object.keys(jue[juex].nro_player_act).length!=0)
{
io.sockets.emit("los demas bar jue",
{
nro_game: juex,
type_game: jue[juex].type_game,
list_word_name: jue[juex].list_word_name,
nro_player: jue[juex].nro_player
});
}//if hay jugadores
}//for
  
//---chat---

//---users---  
  
socket.on("pedir usuario en chat",function()
{
//socket.id, socket.request.user, socket.rooms, socket.adapter
console.log("entro a chat "+ socket.request.user.firstname);
//console.log(socket.request.user) 
console.log(Object.keys(socket.adapter.rooms).length)//cantidad de usuarios online
/*
{ 'OoGV-XjIt2V8k2kmAAAA': Room { sockets: { 'OoGV-XjIt2V8k2kmAAAA': true }, length: 1 },
bstlk: Room { sockets: { 'OoGV-XjIt2V8k2kmAAAA': true }, length: 1 } }
*/
if(socket.request.user)
{
users_cnnt[socket.request.user._id]= {user: socket.request.user, //!!!no mandar el user
skt_id:socket.id};
io.sockets.emit('recibir usuarios', users_cnnt);
for( var room in users_room)
{
io.to(socket.id).emit("actualizar rooms",
{users_room: users_room[room], room:room});
}//for actualiza, cuando entra 
User.findOne({_id:socket.request.user._id}, (err, user) =>
{
if(!user.online)
{
user.online= false;
}
user.online= true;
user.save((err)=>
{
if (err) throw err;
})//save
})//findone  
User.find({online: {$eq: false} }).sort({fecha_de_login:-1}).limit(5).exec(function(err,users_5_no)
{
console.log("emit: last 5 connected users")
io.sockets.emit("last 5 connected users", users_5_no)  
});//find last 5   
}//if user lgged
//console.log(socket.request.user.logged_in);
});//skon pedir usuario en chat

socket.on("ver su profile",function(obj_userf)
{
//obj_userf{user_id_rcv,skt_id_rcv,skt_id_mnd}
console.log("ver su perfil");
console.log(obj_userf); 
var user={}; 
User.findOne({_id:obj_userf.user_id_rcv},(err,user)=>
{
//console.log(user);
user.firstname=user.firstname;
user.lastname=user.lastname;
user.avatar=user.avatar;
user.age=user.age;
user.gender=user.gender;
user.country=user.country;
user.speaks=user.speaks;
user.learning=user.learning;
user.about_me=user.about_me;
io.to(obj_userf.skt_id_mnd).emit("perfil a ver",
{
user:user,
user_id_rcv:obj_userf.user_id_rcv,
skt_id_rcv:obj_userf.skt_id_rcv
});
});//findone  
});//skon ver su profile    
  
//...users...
  
//---rooms---
  
socket.on('abrir room',function(roomf)
{
//roomf="gnrl" roomf
console.log("abre room:"+roomf)
if(!users_room[roomf])
{
users_room[roomf]={};
}//if indef
//console.log(users_room[roomf])
users_room[roomf][socket.request.user._id]= socket.request.user.firstname;
socket.join(roomf);
console.log("joined in "+roomf);
//console.log(io.sockets.adapter.rooms[roomf]);   
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},
function(err,chatf){
if(!chatf.chats[roomf])
{
//chatf.chats[roomf.room_bth]=["hi"]; 
//chatf.chats={};
chatf.chats[roomf]=[];
}//if no existe, crea
chatf.markModified("chats."+roomf);
//console.log(chatf.chats);
chatf.save((err)=>
{
if(err) throw err;
//console.log("savedddd");
io.to(roomf).emit('recibir usuarios en el room',
{
users_room:users_room[roomf],
chat_room:chatf.chats[roomf],
skt_id:socket.id,
room:roomf
});
io.sockets.emit("actualizar rooms",
{
users_room:users_room[roomf],
chat_room:chatf.chats[roomf],
skt_id:socket.id,
room:roomf
});
});//save
});//findone
/* creado nuevo objeto, para chats prv, otro para reportes
//_id chats_prv 5a36957e2659be546185f785
//_id reportes 5a3694ecfe052c4f9add75ff
var newChat=new Chat();
newChat.chats_prv= {};
newChat.save(function(err){
if(err) throw err;
});//save
*/
});//skon abre general
  
  
  
socket.on('enviar msg al room', function(obj_msgf)
{
//obj_msgf{msg(in_msg_val),room,type_room}
console.log("enviar msg a room: "+obj_msgf.type_room)
obj_msgf.msg= emoji.emojify(obj_msgf.msg);
obj_msgf.msg= reemplazarMayor_o_menor(obj_msgf.msg);  
obj_msgf.msg= haber_link(obj_msgf.msg);
if(obj_msgf.type_room==="public")
{
Chat.findOne({_id:"5a03c2696602c617ed34b85f"},function(err,chatf)
{
var con_sav=socket.request.user.firstname+": "+obj_msgf.msg;
if(chatf.chats[obj_msgf.room].length<15)
{
chatf.chats[obj_msgf.room].push(con_sav);
}else{
chatf.chats[obj_msgf.room].shift();
chatf.chats[obj_msgf.room].push(con_sav);
}//else shift and push
chatf.markModified("chats."+obj_msgf.room);
chatf.save((err)=>
{
if(err) throw err;
});//save
});//findone
}//if type_room public
io.to(obj_msgf.room).emit('recibir msg en room',
{
msg:obj_msgf.msg,
nick:socket.request.user.firstname,
room:obj_msgf.room
});
});//skon enviar msg al room


  
socket.on("cerrar room",function(roomf)
{
//roomf="room_bth o gnrl" room
console.log("cierra room:"+roomf);
socket.leave(roomf);
if(!socket.id) return;
//console.log(users_room[roomf]);
if(users_room[roomf])
delete users_room[roomf][socket.request.user._id];
io.to(roomf).emit('recibir usuarios en el room',
{users_room:users_room[roomf], room:roomf});
/*
io.to(socket.id).emit('recibir usuarios en el room',
{users_room:users_room[roomf],
room:roomf});*/
io.sockets.emit("actualizar rooms",
{users_room:users_room[roomf], room:roomf});
/*else{
socket.leave(roomf);
//corregir room privados !!!
io.to(roomf).emit("dejar prv",roomf); 
}//else el prv   */  
});//skon cerrar room  
  
  
  
socket.on("typing",function(obj_roomf)
{
//obj_roomf{room}
//socket.to(obj_roomf.room).broadcast.emit("who type",
io.to(obj_roomf.room).emit("who type",
{firstname: socket.request.user.firstname, room:obj_roomf.room});
});//typing
  
socket.on("entrar a secret room",function(room_secretf)
{
//room_secretf=secret name's room
console.log("entra a secret room: "+room_secretf)
if(!users_room[room_secretf])
{
users_room[room_secretf]={};
}//if indef
//console.log(users_room[room_secretf])
users_room[room_secretf][socket.request.user._id]= socket.request.user.firstname;
socket.join(room_secretf);
console.log(io.sockets.adapter.rooms[room_secretf]);
io.to(room_secretf).emit('recibir usuarios en secret room',
{
users_room:users_room[room_secretf],
skt_id:socket.id,
room:room_secretf
});
});//skon entrar a secret room
  
//...rooms...
  
 
  
//---chat privado---
  
socket.on("mandar chat request",function(obj_userf)
{
//obj_userf{skt_id_rcv,user_id_rcv,skt_id_mnd}
console.log("2hizo chat request");
console.log(obj_userf);
var id_mnd= socket.request.user._id;
var user_id_rcv= obj_userf.user_id_rcv;
var room_bth= id_mnd> user_id_rcv?
id_mnd+"_"+user_id_rcv:
user_id_rcv+"_"+id_mnd;
if(!users_room[room_bth]){
users_room[room_bth]={};
}//if indef
//users_room{room_nme{user_id:firstname,...},...}
users_room[room_bth][socket.request.user._id]= [socket.request.user.firstname,socket.id];
socket.join(room_bth);
console.log(io.sockets.adapter.rooms[room_bth]); 
io.to(obj_userf.skt_id_rcv).emit("recibir chat request",
{
nme_mnd:socket.request.user.firstname,
skt_id_mnd:obj_userf.skt_id_mnd,
skt_id_rcv:obj_userf.skt_id_rcv,
room_bth:room_bth
}); //skt_clt_id de quien la manda
if(users_cnnt[user_id_rcv])
var nme_rcv= users_cnnt[user_id_rcv].user.firstname;
io.to(room_bth).emit("esperar chat request",
{
skt_id_mnd:obj_userf.skt_clt_id,
skt_id_rcv:obj_userf.skt_id_rcv,
nme_rcv:nme_rcv,
room_bth:room_bth
});
});//skon mandar chat request
 


socket.on("cancelar chat request of", function(obj_roomf)
{
//obj_roomf{room_bth,skt_id_rcv,skt_id_mnd}
console.log("cancela chat request of")
socket.to(obj_roomf.skt_id_mnd).emit("cancelar chat request of", obj_roomf)
});//skon cancelar chat request of  
  
  
socket.on("cancel chat request",function(obj_userf)
{
//obj_userf{skt_id_rcv,room_bth}
console.log("cancelo chat request")
//y sacarlo del room
socket.to(obj_userf.skt_id_rcv).emit("eliminar chat request",
{room_bth:obj_userf.room_bth});
});//skon cancel request
  
  
  
  
socket.on("abrir chat request",function(obj_userf)
{
//obj_userf{room_bth,skt_id_mnd}
console.log("4abre chat request");
users_room[obj_userf.room_bth][socket.request.user._id]= socket.request.user.firstname;
socket.join(obj_userf.room_bth);
console.log(io.sockets.adapter.rooms[obj_userf.room_bth]);
var nme_rcv= socket.request.user.firstname;
var user_id_mnd= "";
for(var useri in users_cnnt)
{
if(users_cnnt[useri].skt_id== obj_userf.skt_id_mnd)
{
user_id_mnd=useri;
break;
}//if
}//for
if(users_cnnt[user_id_mnd]) 
var nme_mnd= users_cnnt[user_id_mnd].user.firstname;
io.to(obj_userf.skt_id_mnd).emit("acepta chat request",
{
nme_rcv:nme_rcv, nme_mnd:nme_mnd,
skt_id_rcv:obj_userf.skt_id_rcv,
skt_id_mnd:obj_userf.skt_id_mnd,
room_bth:obj_userf.room_bth
});
});//skon abrir chat request

  
  
socket.on("aceptar chat request", function(obj_roomf)
{
console.log("aceptar chat request")
//console.log(socket.id)
var room_bth= obj_roomf.room_bth;
io.to(room_bth).emit("cerrar waiting",{room_bth:room_bth}) 
users_room[room_bth][socket.request.user._id]= [socket.request.user.firstname,socket.id];
socket.join(room_bth);
io.to(room_bth).emit("crear chat privado", obj_roomf);
//io.to(skt_mnd).emit("acepta chat request",obj_roomf);
});//skon aceptar chat request  
  
 
  
socket.on("mandar usuarios al chat privado", function(obj_roomf)
{
//obj_roomf{room_bth}
console.log("mandar usuarios al chat privado")
var room_bth= obj_roomf.room_bth;
var m_names= [];
for(var ele in users_room[room_bth])
{
m_names.push(users_room[room_bth][ele])
}//for
var obj_user= {};
obj_user.m_names= m_names;
obj_user.room_bth= room_bth;
var chatprv;
Chat.findOne({_id:"5a36957e2659be546185f785"},function(err,chatf)
{
if(!chatf.chats_prv)
{
chatf.chats_prv= {};
}//if no chats_prv, crear
if(!chatf.chats_prv[room_bth])
{
chatf.chats_prv[room_bth]=[];
}//if no existe, crea
chatf.markModified("chats_prv");//"chats_prv."+room_bth
chatprv= chatf.chats_prv[room_bth]; 
chatf.save((err)=>
{
if(err) throw err;  
obj_user["chat_prv"]= chatprv;
io.to(room_bth).emit("meter usuarios al chat privado", obj_user);
});//save
});//findOne
//obj_user{m_names,room_bth,chat_prv}
});//skon mandar usuarios al chat privado 
 
  
  
socket.on("users al chat request",function(obj_userf)
{
//obj_userf{nme_mnd,nme_rcv,skt_id_rcv,skt_id_mnd,room_bth}
console.log("6users para chat request");
console.log(obj_userf)
//buscar 30 lines chat historial aqui !!!
var id12= obj_userf.room_bth.split("_");
var chatprv;
Chat.findOne({_id:"5a36957e2659be546185f785"},function(err,chatf)
{
if(!chatf.chats_prv)
{
chatf.chats_prv= {};
}//if no chats_prv, crear
if(!chatf.chats_prv[obj_userf.room_bth])
{
chatf.chats_prv[obj_userf.room_bth]=[];
}//if no existe, crea
chatf.markModified("chats_prv."+obj_userf.room_bth);
chatprv= chatf.chats_prv[obj_userf.room_bth]; 
chatf.save((err)=>
{
if(err) throw err;  
obj_userf["chat_prv"]= chatprv;
io.to(obj_userf.room_bth).emit("mete users en chat request", obj_userf);
});//save
});//findone
});//skon users pa chat request
  
  
  
socket.on("send message chat r",function(obj_msgf)
{
//obj_msgf{msg,room_bth}
console.log("envio message chat r")
var id12= obj_msgf.room_bth.split("_");
obj_msgf.msg= emoji.emojify(obj_msgf.msg);
obj_msgf.msg= haber_link(obj_msgf.msg);
Chat.findOne({_id:"5a36957e2659be546185f785"},function(err,chatf)
{
var con_sav=socket.request.user.firstname+": "+obj_msgf.msg;
if(chatf.chats_prv[obj_msgf.room_bth].length<15)
{
chatf.chats_prv[obj_msgf.room_bth].push(con_sav);
}else{
chatf.chats_prv[obj_msgf.room_bth].shift();
chatf.chats_prv[obj_msgf.room_bth].push(con_sav);
}//else shift and push    
chatf.markModified("chats_prv."+obj_msgf.room_bth); 
chatf.save((err)=>
{
if(err) throw err;
});//save  
});//findone  
io.to(obj_msgf.room_bth).emit("new msg chat request",
{
msg:obj_msgf.msg,
nick:socket.request.user.firstname,
room:obj_msgf.room_bth
});
});//skon send message chat rquest
  
//...chat privado...
  
//---llamada---

socket.on("solicitar llamada",function(obj_room_callf)
{
//obj_room_callf{room_rtc:room_bth}
console.log("solicita llamada");
io.to(obj_room_callf.room_rtc).emit("solicitud de aceptacion de la llamada",
{
room_rtc:obj_room_callf.room_rtc, 
skt_id_mnd:socket.id,
nme_mnd: socket.request.user.firstname
});
});//skon solicitar llamada  
  
 
  
socket.on("cancelar llamada entrante", function(obj_room_callf)
{
//obj_room_callf{room_rtc}
console.log("cancelar llamada entrante de: "+obj_room_callf.room_rtc)
io.to(obj_room_callf.room_rtc).emit("se cancelo llamada", {room_rtc:obj_room_callf.room_rtc});
});//skon cancelar llamada entr  
  

  
socket.on("correr llamada",function(obj_room_callf)
{
//obj_room_callf{room_rtc}
console.log("correr llamada en: "+obj_room_callf.room_rtc)
io.to(obj_room_callf.room_rtc).emit("correr web rtc", {room_rtc:obj_room_callf.room_rtc});
});//skon correr llamada  
  
 
socket.on("colgar llamada",function(obj_room_callf)
{
//obj_room_callf{room_rtc}
console.log("colgar llamada en: "+obj_room_callf.room_rtc)
io.to(obj_room_callf.room_rtc).emit("se cuelga llamada", {room_rtc:obj_room_callf.room_rtc});
});//skon colgar llamada 
  
//...llamada...
  

  
//---play---
  
  
socket.on("solicitar game",function(obj_gamef)
{
//obj_gamef{type_game,list_word,nro_player}
console.log("2solicitar juego");
console.log(obj_gamef);
var nro_game= "jue"+Object.keys(jue).length;  
jue[nro_game]= {
nro_game: nro_game,
tiempo:0,
mod:"",
word_to_guess:"",
type_game: obj_gamef.type_game,
list_word_name:obj_gamef.list_word,
list_word: list_words[obj_gamef.list_word],
player_trn:"", 
nro_player: obj_gamef.nro_player,
nro_player_act: {}
};//jue{}
io.to(socket.id).emit("crear juego",
{
nro_game: nro_game,
type_game: obj_gamef.type_game,
list_word: obj_gamef.list_word,
nro_player: obj_gamef.nro_player 
});
//socket.broadcast.emit("los demas bar jue",
io.sockets.emit("los demas bar jue",
{
nro_game:nro_game,
type_game:obj_gamef.type_game,
list_word_name:obj_gamef.list_word,
nro_player:obj_gamef.nro_player
});
});//skon solicitar game  
  
  
socket.on('entrar roomj',function(obj_gamef)
{
//obj_gamef{nro_game,type_game,list_word,nro_player}
console.log("3entrando al juego");
console.log(obj_gamef);
var user_id= socket.request.user._id;
var fn=  socket.request.user.firstname;
if(!jue[obj_gamef.nro_game])
{
console.log("no hay "+obj_gamef.nro_game);
io.sockets.emit("eliminar game bar",{room_game:obj_gamef.nro_game});
}else{//else hay jue
var nro_in_game= Object.keys(jue[obj_gamef.nro_game].nro_player_act).length;
if(nro_in_game< (jue[obj_gamef.nro_game].nro_player-1) )
{
console.log("cant menor que nro_player-1");
jue[obj_gamef.nro_game].nro_player_act[user_id]=[fn,socket.id,0];
//[fn,skt_id,puntaje]
console.log(typeof jue[obj_gamef.nro_game]);
socket.join(obj_gamef.nro_game);
users_jue[socket.request.user._id]= {firstname:socket.request.user.firstname,
skt_id:socket.id};
var usergame= jue[obj_gamef.nro_game].nro_player_act; 
io.to(obj_gamef.nro_game).emit("manda user al juego",
{
users_jue:usergame,
nro_game:obj_gamef.nro_game,
type_game:obj_gamef.type_game,
list_word:obj_gamef.list_word,
nro_player:obj_gamef.nro_player
});
}//if nro_player_act<nro_player-1: junta
else if(nro_in_game== (jue[obj_gamef.nro_game].nro_player-1) )
{
console.log("cant igual que nro_player-1")
jue[obj_gamef.nro_game].nro_player_act[user_id]=[fn,socket.id,0];
//[fn,skt_id,puntaje]
socket.join(obj_gamef.nro_game);
//decir que room_game, para luego eliminarlo en disconnect
users_jue[socket.request.user._id]= {firstname:socket.request.user.firstname, skt_id:socket.id};
var usergame= jue[obj_gamef.nro_game].nro_player_act; 
io.to(obj_gamef.nro_game).emit("manda user al juego",
{
users_jue:usergame,
nro_game:obj_gamef.nro_game,
type_game:obj_gamef.type_game,
list_word:obj_gamef.list_word,
nro_player:obj_gamef.nro_player
});
//str_game(jue[obj_gamef.nro_game]);
//start playerer 0 va sumando 0%nro_player
var player_trn= 0;
jue[obj_gamef.nro_game].player_trn= 0;
var pmr_id= Object.keys(jue[obj_gamef.nro_game].nro_player_act)[player_trn];
var pmr_user= jue[obj_gamef.nro_game].nro_player_act[pmr_id];//[fn,skt_id]
jue[obj_gamef.nro_game].word_to_guess= jue[obj_gamef.nro_game].list_word[dar_aleatoria_pos(0, jue[obj_gamef.nro_game].list_word.length)];  
io.to(obj_gamef.nro_game).emit("los que adivinan",{userexpl: pmr_user[0]});
io.to(pmr_user[1]).emit("el del turno",{word: jue[obj_gamef.nro_game].word_to_guess});
//tiempo=20;
//nota el tiempo de ese juego jue[obj_gamef.nro_game].tiempo
jue[obj_gamef.nro_game].tiempo=90;
jue[obj_gamef.nro_game].mod="ten";
cuenta_regresiva(obj_gamef.nro_game,jue[obj_gamef.nro_game].player_trn);
}//elseif nro_player_act==nro_player-1 : junta y comienza
else{
console.log("juego comenzado");
io.to(socket.id).emit("ya comenzo jue",{msg:"complete game, create a new one"});
}//else, comenzado
}//else hay jue
});//skon entra juego
 
//los tiempos se manejan del lado del server.  
  
  
  
function cuenta_regresiva(roomjf)
{
io.to(roomjf).emit("corre reloj",{tiempo:jue[roomjf].tiempo});
jue[roomjf].tiempo-= 1;
if(jue[roomjf].tiempo> 0)
{
setTimeout(function(){
cuenta_regresiva(roomjf);},1000);
}//if
else if(jue[roomjf].mod=="ten")
{
io.to(roomjf).emit("no se adivino",{word_to_guess: jue[roomjf].word_to_guess});
jue[roomjf].tiempo= 10;
jue[roomjf].mod="turn";
cuenta_regresiva(roomjf);
}//else if ten
else if(jue[roomjf].mod=="turn")
{
console.log("new turn?");
console.log(Object.keys(jue[roomjf].nro_player_act));
var winner="";
for(var i=0;i<Object.keys( jue[roomjf].nro_player_act).length;i++)
{
if(jue[roomjf].nro_player_act[
Object.keys(jue[roomjf].nro_player_act)[i]
][2]>= 10)
{
winner=jue[roomjf].nro_player_act[
Object.keys(jue[roomjf].nro_player_act)[i]
][0];
console.log("ganó");
console.log(winner);
break;
}//if 10
}//for
if(winner=="")
{
jue[roomjf].player_trn++;
jue[roomjf].tiempo= 90;
jue[roomjf].mod="ten";
var pmr_id= Object.keys(jue[roomjf].nro_player_act)[ jue[roomjf].player_trn% Object.keys(jue[roomjf].nro_player_act).length ];
var pmr_user= jue[roomjf].nro_player_act[pmr_id];//[fn,skt_id]
jue[roomjf].word_to_guess= jue[roomjf].list_word[dar_aleatoria_pos(0,jue[roomjf].list_word.length)];  
if(Object.keys(jue[roomjf].nro_player_act).length>1)
{
io.to(roomjf).emit("los que adivinan",{userexpl: pmr_user[0]});
io.to(pmr_user[1]).emit("el del turno",{word: jue[roomjf].word_to_guess});
cuenta_regresiva(roomjf); 
}//if cantplayer>1
}//if no winner
else{
io.to(roomjf).emit("quien gano", {winner_nme:winner});
}//else, quien gano
}//else if next
else{
console.log("else");  
}//else
}//count down



function 
dar_aleatoria_pos(a,b)
{
return Math.floor(Math.random() * b) + a;
};//random number entre 0 y m.length
  
  
  
socket.on("10 seg",function(objnro_gamef)
{
//objnro_gamef{nro_game}
console.log("10 seg next turn");
console.log(jue[objnro_gamef.nro_game].tiempo);
jue[objnro_gamef.nro_game].tiempo=10;
jue[objnro_gamef.nro_game].mod="turn";
//next turn
});//10 seg para next turn player    
  
  


  
  
socket.on('send message jue',function(obj_msg_gamef)
{
//obj_msg_gamef{msg,nro_game}
console.log("enviar msg jue: "+obj_msg_gamef)
var pmr_id= Object.keys(jue[obj_msg_gamef.nro_game].nro_player_act)[ jue[obj_msg_gamef.nro_game].player_trn% Object.keys(jue[obj_msg_gamef.nro_game].nro_player_act).length ];
var skt_id_player= jue[obj_msg_gamef.nro_game].nro_player_act[pmr_id][1];//[fn,skt_id]
var sme_jug= skt_id_player==socket.id;//same jugador ?
var re=new RegExp(jue[obj_msg_gamef.nro_game].word_to_guess,"i");
if(re.test(obj_msg_gamef.msg)
&&jue[obj_msg_gamef.nro_game].mod=="ten"
&&!(sme_jug))
{
var guess=true;
}//if
obj_msg_gamef.msg= emoji.emojify(obj_msg_gamef.msg);
obj_msg_gamef.msg= haber_link(obj_msg_gamef.msg);
io.to(obj_msg_gamef.nro_game).emit('new message jue',
{
msg:obj_msg_gamef.msg,
nro_game:obj_msg_gamef.nro_game,
nick:socket.request.user.firstname,
guess:guess
});
if(guess)
{
var user_id= socket.request.user._id;
jue[obj_msg_gamef.nro_game].nro_player_act[user_id][2]+=1;
//puntaje
console.log("punteo");
console.log(jue[obj_msg_gamef.nro_game].nro_player_act);
var pnt_player= jue[obj_msg_gamef.nro_game].nro_player_act[user_id][2];
io.to(obj_msg_gamef.nro_game).emit("actualiza puntaje",
{user_id: user_id, pnt_player: pnt_player});  
}//if adivina, suma 
});//sk send msg juego
  
   

socket.on("salir del juego",function(obj_room_jf)
{
//obj_room_jf{room}
console.log("sale del jue: "+obj_room_jf),
socket.leave(obj_room_jf.room);
var user_id= socket.request.user._id;
if(!socket.id) return;
if(jue[obj_room_jf.room])
{
delete jue[obj_room_jf.room].nro_player_act[user_id];//eliminar
var nro_player_act= jue[obj_room_jf.room].nro_player_act;
var nro_in_game= Object.keys(jue[obj_room_jf.room].nro_player_act).length;
}//if obj_room_jf.room
if(nro_in_game==0)
{//elimina bar
io.sockets.emit("eliminar game bar",{room_game:obj_room_jf.room});
}else{
io.sockets.emit("manda user al juego",
{users_jue: nro_player_act, nro_game: obj_room_jf.room});
}//else manda user al juego
});//skon salir del juego
  
  
//...play...
  

//---nota---
  
//guardar nota
socket.on("save note",function(obj_ntef)
{
//obj_ntef{nte}
User.findOne({_id: socket.request.user._id}, function(err,userf)
{
if(!userf.notes)
{
userf.notes="";
}
userf.notes= obj_ntef.nte;
userf.save((err)=>
{
if(err) throw err;
});//save
});//findone
console.log("saved note");
});//skon save note  
  
  
//...nota...  
  
//---reporte---
  
socket.on("reporte",function(obj_rptf)
{
//obj_rptf{tit,rpt}
console.log("guarda reporte");
Chat.findOne({_id:"5a3694ecfe052c4f9add75ff"},function(err,chatf){
chatf.reportes.push(
[
socket.request.user._id,
socket.request.user.firstname,
obj_rptf
]);
chatf.save((err)=>
{
if(err) throw err;
});//save
});//findone
});//reporte 
  
//...reporte...
  
  
socket.on('disconnect', function() 
{
//console.log(socket.request.user);
io.to(socket.id).emit("se desconecto",{msg:"desconexión o cerro"});
if(!socket.id) return;
delete users_cnnt[socket.request.user._id];
User.find({online: {$eq: false} }).sort({fecha_de_login:-1}).limit(5).exec(function(err,users_5_no)
{
console.log("emit: last 5 connected users")
io.sockets.emit("last 5 connected users", users_5_no)  
});//find last 5 
io.sockets.emit('recibir usuarios', users_cnnt);
console.log("se desconecto "+ socket.request.user.firstname);
for(var room in users_room)
{
if(users_room[room][socket.request.user._id]){
if(!socket.id) return;
delete users_room[room][socket.request.user._id];
io.to(room).emit('recibir usuarios en el room',
{users_room:users_room[room], room:room});
io.sockets.emit("actualizar rooms",
{users_room:users_room[room], room:room});   
}//if
}//for
User.findOne({_id:socket.request.user._id}, (err, user) =>
{
user.online= false;
user.save((err)=>
{
if (err) throw err;
})//save
})//findone    
console.log(socket.request.user)  
/* del control total de usuarios, eliminarlo
delete users_jue[socket.request.user._id];
io.sockets.emit("manda user al juego",users_jue);*/
});//skon disconnect
  
  
  
  
});//skcn socket connection


// listen for requests :)
/*var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/


//link catcher
function haber_link(tf)
{
var re=/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
var mctch=tf.match(re);
if(mctch)
{
var lc= mctch[0];
var tm= tf.replace(lc,taggear_a(lc))
return tm;
}else{
return tf;
}//else
function 
taggear_a(lf)
{
var a='<a href="'+lf+'" target="_blank">'+
lf+'</a>';
return a;        
}//taggear_a
}//haber_link

function reemplazarMayor_o_menor(t)
{
t=t.replace(/</g,"&#60;")
t=t.replace(/>/g,"&#62;")
return t;
}//reemplazarMayor_O_Menor
