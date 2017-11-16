//despues de socket.io/socket.io.js

var sktclt=io.connect();


//====entra al chat
function entrchT(){
  
 sktclt.emit("userva",sktclt.id);
}//click tab chat



sktclt.on("usernames",function(dat){
  //dat-usrscnnt{sktcltid:user}
  //user{_id,email,firstnm,lastnm,chats[]}
 var conusr="";

for(var usrnme in dat){
 conusr+="<tr id=\'"+usrnme+
   "\' onclick='usrprfchtR(this)' >"+
//onclick='dainfU(this)' 
  "<td>"+dat[usrnme].firstnm+" "+dat[usrnme].lastnm+"</td>"+
  "<td>"+(dat[usrnme].gender||"-")+"</td>"+
  "<td>"+(dat[usrnme].age||"-")+"</td>"+
  "<td>"+(dat[usrnme].country||"-")+"</td>"+
  "<td>"+(dat[usrnme].learning||"-")+"</td>"+
  "<td>"+(dat[usrnme].speaks||"-")+"</td>"+
 "</tr>";
}//for

tblusrsbd.innerHTML=conusr;

});//skon usernames table






//====general room

function entrgnrL(){
  
  if(typeof(dvicht)=="undefined"){
 var nudiv=document.createElement("DIV");
nudiv.id="dvicht";


nudiv.innerHTML='<div id="dvichtt">'+
    '<div id="dvichttn">General</div>'+
  '<div id="dvichttm" onclick="mindvichT()">-</div>'+
  '<div id="dvichttl" onclick="restamchT()">L</div>'+
  '<div id="dvichttx" onclick="crrdvichT()">x</div>'+
  '</div>'+
  '<div id="dvichtcu">'+
  '<div id="dvichtc"></div><div id="dvichtu"></div>'+
  '</div>'+  
  '<div id="dvichtmsg"><form id="fmisndmsg" onsubmit="envmsG(event)">'+
  '<input type="text" id="inimsg" placeholder="write your message">'+
  '<button id="btnimsg" type="submit" >send</button>'+
  '</form></div>';

dvchtc.appendChild(nudiv);

sktclt.emit("opngnrl");

jQuery(function($){

var draggableDiv = $('#dvicht').draggable();
$('#dvichtc', draggableDiv).mousedown(function(ev) {
  draggableDiv.draggable('disable');
}).mouseup(function(ev) {
  draggableDiv.draggable('enable');
});
  
$("#dvicht").resizable();

});//jQuery
  }//if no dvicht
}//entrar al general room


sktclt.on("mndusrgnrl",function(dt){
  //dt{usrsgnrl,chtgnrl,sktid}  
   //15 lines of chat
  var usrsg=""
  
  for(var nombr in dt.usrsgnrl){
    usrsg+=dt.usrsgnrl[nombr]+"<br>";
  }
 dvichtu.innerHTML="";
 dvichtu.innerHTML=usrsg;
  
  
  if(dt.sktid==sktclt.id){
  var licht=dvichtc.innerHTML;

  for(var msgcht in dt.chtgnrl){
    licht+=dt.chtgnrl[msgcht]+"<br>";
  }
 dvichtc.innerHTML=licht;
  }//if es el que llega
});//skon mandaron el usuario



function mindvichT(){

jQuery(function($){
//$("#dvichttm").click(function(){
  
    if($("#dvichttm").html()=="-"){
    $("#dvicht").height(30);
      $("#dvichttm").html("+");
      $("#dvichtcu").hide();
      $("#dvichtmsg").hide();
      $("#dvicht").resizable("disable");
      $('#dvicht').css('z-index', 9999);
      
    }//if -
    else{
      $("#dvicht").height(200);
      $("#dvichttm").html("-");
      $("#dvichtcu").show();
      $("#dvichtmsg").show();
      $("#dvicht").resizable("enable");
    }//else +
    
    
 //});//minimizar

});//jQuery
}//minimizar dvicht

function restamchT(){
if(dvicht.offsetWidth<dvchtc.offsetWidth){
  dvicht.style.height=dvchtc.offsetHeight+"px";
  dvicht.style.width=dvchtc.offsetWidth+"px";
  dvicht.style.left=0;
  dvicht.style.top=0;
}//if pequeño
  else{
    dvicht.removeAttribute("style");
  }//else retorna
}//restaura tamaño

function crrdvichT(){
 dvchtc.removeChild(dvicht);
 sktclt.emit("cerrgnrl");
   
}//cerrar dvicht


function envmsG(ev){
  ev.preventDefault();

if(inimsg.value!=""){
 sktclt.emit("send message",
              inimsg.value);
}//if no vacio

inimsg.value="";
}//on send msg, del form



sktclt.on('new message', function(data) {
//data{msg,nick}
 
jQuery(function($){
  $("#dvichtc").append('<b>'+data.nick+":</b> "+data.msg+"<br/>");
  $("#dvichtc").stop().animate({ scrollTop: $("#dvichtc")[0].scrollHeight}, 200);
});//jQuery
});//on receive msg





//====inf usr

function nooP(){}//no operations, for swap functions

function usrprfchtR(ele){
  
 if(typeof(dvinfusr)=="undefined"){
var nuedvinfusr=document.createElement("DIV");
  nuedvinfusr.id="dvinfusr";
  
  nuedvinfusr.innerHTML='<div id="dvinfprfcht">'+
    '<li id="liprf'+ele.id
  +'" onclick="prfinF(this)">Profile</li>'+
    '<li id="lichtrqs'+ele.id+
  '" onclick="chtrqsT(this)">Chat Request</li>'+
    '</div>'+
    '<div id="dvcrrprfcht" onclick="crrinfusR()">x</div>';
  
 dvchtc.appendChild(nuedvinfusr);
 }//if no existe: crea
}//profile y chat request del user


function prfinF(ele){
  
  console.log("perfil del chat, "+ele.id);
  
}//info profile

function chtrqsT(ele){
  var prtid=ele.id.substr(8,ele.id.length);
  console.log("mando chtrqs");
  sktclt.emit("mnd chtrqs",{sktidrcv:prtid,sktidmnd:sktclt.id});
  //{sktidrcv,sktcltidmnd}
 alert("chat request, in construction");
  crrinfusR();
}//chat request

function crrinfusR(){
  dvchtc.removeChild(dvinfusr);
  
}//cerrar inf prf y cht rqst

sktclt.on("recibe chtrqs",function(dt){
  //dt{nmemnd,idrcv,sktidmnd,sktidrcv,roombth}
  console.log("me dieron chtrqs");
  console.log(dt);
  
  var nudiv=document.createElement("div");
nudiv.id="dvchtrqsof";

nudiv.innerHTML='<div id="dvchtrqsof_t">Chat request from '+dt.nmemnd
  +'</div>'+
    '<div id="dvchtrqsof_m" onclick="opnchtrqS(\''+dt.roombth+'\',\''+
  dt.sktidmnd+'\')">+</div>'+
    '<div id="dvchtrqsof_x">X</div>';

dvchtc.appendChild(nudiv);
  
});

sktclt.on("espera chtrqs",function(dt){
  //dt{idmnd,idrcv,sktidmnd,sktidrcv,roombth}
  if(dt.sktidmnd==sktclt.id){
    
  console.log("espera chtrqs");
  console.log(dt);
  if(typeof(dvwti)=="undefined"){  
  var nudiv=document.createElement("div");
nudiv.id="dvwti";

nudiv.innerHTML='<div id="dvwti_t">Waiting...</div>'+
 '<div id="dvwti_x">X</div>';

dvchtc.appendChild(nudiv);
  }//if dvwti no creado
  }//if es el que espera
});

function opnchtrqS(roombthx,sktidmndx){
  
  if(typeof(dvchtrqswth)=="undefined"){
  var nudiv=document.createElement("DIV");
nudiv.id="dvchtrqswth";


nudiv.innerHTML='<div id="dvchtr_t">'+
    '<div id="dvchtr_tn">Chat with</div>'+
  '<div id="dvchtr_tm" onclick="mindvchtR()">-</div>'+
  '<div id="dvchtr_tl" onclick="restamchtR()">L</div>'+
  '<div id="dvchtr_tx" onclick="crrdvchtR()">x</div>'+
  '</div>'+
  '<div id="dvchtr_cu">'+
  '<div id="dvchtr_c"></div><div id="dvchtr_u"></div>'+
  '</div>'+  
  '<div id="dvchtr_msg"><form id="fmr_sndmsg" onsubmit="envmsgR(event)">'+
  '<input type="text" id="inr_msg" '+
  'data-room="'+roombthx+
  '" placeholder="write your message">'+
  '<button id="btnr_msg" type="submit" >send</button>'+
  '</form></div>';

dvchtc.appendChild(nudiv);
    
    jQuery(function($){

var draggableDiv = $('#dvchtrqswth').draggable();
$('#dvchtr_c', draggableDiv).mousedown(function(ev) {
  draggableDiv.draggable('disable');
}).mouseup(function(ev) {
  draggableDiv.draggable('enable');
});
  
$("#dvchtrqswth").resizable();

});//jQuery

  if(sktidmndx){
    sktclt.emit("abr chtrqs",
                {roombth:roombthx,
                 sktidmnd:sktidmndx});
  }//if objeto sktidmndx
  }//if dvchtrqswth no creado
  
  
}//abir chat request

function crrdvchtR(){
 dvchtc.removeChild(dvchtrqswth);
 //sktclt.emit("cerrgnrl");
   
}//cerrar dvicht

sktclt.on("aceptd chtrqs",function(dt){
  //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("aceptada chtrqs");
  console.log(dt);
  
  opnchtrqS(dt.roombth);
  sktclt.emit("usrs pa chtrqs",dt);  
});

sktclt.on("mete usrs chtrqs",function(dt){
  //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  
    console.log("nombres en lis");
    dvchtr_u.innerHTML=dt.nmercv+"<br id='brrcv' data-sktid='"+dt.sktidrcv+"'/>"+
        dt.nmemnd+"<br id='brmnd' data-sktid='"+dt.sktidmnd+"'/>";
  
});//meter usuario

sktclt.on("palroomprv",function(dt){
  console.log(dt);
});

function envmsgR(ev){
  ev.preventDefault();
  
  if(inr_msg.value!=""){
 sktclt.emit("send messagecht_r",
             {msg:inr_msg.value,
      roombth:inr_msg.getAttribute("data-room")});
}//if no vacio

inr_msg.value="";
  
}//enviar message privado

sktclt.on("new msgchtrqs",function(dt){
  //dt{msg,nick}
  jQuery(function($){
  $("#dvchtr_c").append('<b>'+dt.nick+":</b> "+dt.msg+"<br/>");
  $("#dvchtr_c").stop().animate({ scrollTop: $("#dvchtr_c")[0].scrollHeight}, 200);
});//jQuery
});//nueve msg private


//=====juego

var roomj="roomjue";


sktclt.on("mndusrjue",function(dt){
  //dt{usrid(firstnm)}
  console.log("recibe user pal juego");
 var usrj="";

for(var nom in dt){
 usrj+=dt[nom]+"<br>";
}//for
dvjuse.innerHTML="";
dvjuse.innerHTML=usrj;
  
});//se juntaron al juego


function crtgaM(){
   if(typeof(dvjue)=="undefined"){
var nudivj=document.createElement("DIV");
nudivj.id="dvjue";

nudivj.innerHTML='<div id="dvjtit" draggable="true">'+
'<div id="dvjnm">'+
  '<div id="dvjnmtit">Explain The Word</div>'+
  '<div id="dvjnmmin">-</div>'+
  '<div id="dvjnmmit" onclick="restamjuE()">L</div>'+
  '<div id="dvjnmcrr" onclick="crrjuE()">X</div>'+
  '</div>'+
'<div id="dvjexp">Explains: <span>wordX</span'+
'><span id="sptmr">00</span></div></div>'+
'<div id="dvjcu">'+
'<div id="dvjcon"></div>'+
'<div id="dvjuse">Users</div>'+
'</div><div id="dvjmsg">'+
'<form id="fmjmsg" onsubmit="envmsgJ(event)">'+
'<input type="text" id="injmsg" placeholder="write your text..."'+
'><input type="submit" value="Send" id="btnjsndm" >'+
'</form></div></div>';

  dvgmc.appendChild(nudivj);
    
  sktclt.emit("entroomj",roomj);
  
  jQuery(function($){

var draggableDiv = $('#dvjue').draggable();
$('#dvjcon', draggableDiv).mousedown(function(ev) {
  draggableDiv.draggable('disable');
}).mouseup(function(ev) {
  draggableDiv.draggable('enable');
});
  
$("#dvjue").resizable();

});//jQuery
}//if no esta, crea
};//crear juego


function restamjuE(){
  
  if(dvjue.offsetWidth<dvgmc.offsetWidth){
  dvjue.style.height=dvgmc.offsetHeight+"px";
  dvjue.style.width=dvgmc.offsetWidth+"px";
    dvjue.style.left=0;
  dvjue.style.top=0;
  }//if pequeño
  else{
    dvjue.removeAttribute("style");
  }//else retorna
}//restaurar tamaño del juego


function crrjuE(){
  dvgmc.removeChild(dvjue);
  sktclt.emit("slrjue");
}//cerrar juego


function envmsgJ(ev){
  ev.preventDefault();

if(injmsg.value!=""){
 sktclt.emit("send messagejue",
              injmsg.value);
}//if no vacio

injmsg.value="";
}//on send msg jue, del form envmsgJ(event)


sktclt.on('new messagejue', function(data) {
  //data{msg,nick}
   if(/bingo/i.test(data.msg)){
     dvjcon.innerHTML+="<b>"+data.nick+":</b> "+data.msg+"<br/>"+
                        "BINGO, you guessed the word!<br>";
   }else{
     dvjcon.innerHTML+="<b>"+data.nick+":</b> "+data.msg+"<br/>";
   }
    jQuery(function($){
  $("#dvjcon").stop().animate({ scrollTop: $("#dvjcon")[0].scrollHeight}, 100);
});//jquery
});//on receive msg juego






