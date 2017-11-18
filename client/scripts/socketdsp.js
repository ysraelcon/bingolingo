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
  "<td>"+dat[usrnme].firstnm+
  " "+dat[usrnme].lastnm+"</td>"+
  "<td>"+(dat

[usrnme].gender||"-")+"</td>"+
  "<td>"+(dat[usrnme].age||"-")+"</td>"+
  "<td>"+(dat

[usrnme].country||"-")+"</td>"+
  "<td>"+(dat

[usrnme].learning||"-")+"</td>"+
  "<td>"+(dat

[usrnme].speaks||"-")+"</td>"+
 "</tr>";
}//for

tblusrsbd.innerHTML=conusr;

});//skon usernames table




//====general room

function entrgnrL(rmx){
  
  if(typeof(dvicht)=="undefined"){
    
 var nudiv=document.createElement("DIV");
 nudiv.id="dvcht_gnrl";
nudiv.classList.add("dvcht");
    
nudiv.innerHTML='<div id="dvcht_t_gnrl" class="dvcht_t">'+
    '<div id="dvcht_tnm_gnrl" class="dvcht_tnm">General</div>'+
  '<div id="dvcht_tm_gnrl" class="dvcht_tm" onclick="mindvchT(\'gnrl\')">-</div>'+
  '<div id="dvcht_tl_gnrl" class="dvcht_tl" onclick="restamchT(\'gnrl\')">L</div>'+
  '<div id="dvcht_tx_gnrl" class="dvcht_tx" onclick="crrdvichT(\'gnrl\')">x</div>'+
  '</div>'+
  '<div id="dvcht_cu_gnrl" class="dvcht_cu">'+
  '<div id="dvcht_c_gnrl" class="dvcht_c"></div><div id="dvcht_u_gnrl" class="dvcht_u"></div>'+
  '</div>'+  
  '<div id="dvchtmsg_gnrl" class="dvchtmsg"><form id="fmchtmsg_gnrl" class="fmchtmsg" onsubmit="envmsG(event,\'gnrl\')">'+
  '<input type="text" id="inchtmsg_gnrl" class="inchtmsg"'+
  ' data-room="'+"general"+
  '" placeholder="write your message">'+
  '<button id="btnchtmsg_gnrl" class="btnchtmsg" type="submit" >send</button>'+
  '</form></div>';

dvchtc.appendChild(nudiv);
//juntarlo al room: general !!!
sktclt.emit("opngnrl",rmx);

jQuery(function($){

var draggableDiv = 

$('#dvcht_gnrl').draggable();
  
$('#dvcht_c_gnrl', draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDiv.draggable('enable');
});//mouseup
  
$("#dvcht_gnrl").resizable();

});//jQuery
  }//if no dvicht
}//entrar al general room


sktclt.on("mndusrgnrl",function(dt){
  //dt{usrsgnrl,chtgnrl,sktid}  
   
  var usrsg=""
  
  for(var nombr in dt.usrsgnrl){
    usrsg+=dt.usrsgnrl[nombr]+"<br>";
  }//for
  
 dvcht_u_gnrl.innerHTML="";
 dvcht_u_gnrl.innerHTML=usrsg;
    
  if(dt.sktid==sktclt.id){
    
  var licht=dvcht_c_gnrl.innerHTML;
//15 lines of chat
  for(var msgcht in dt.chtgnrl){
    licht+=dt.chtgnrl[msgcht]+"<br>";
  }//for
 dvcht_c_gnrl.innerHTML=licht;
  }//if es el que llega
});//skon mandaron el usuario


function mindvchT(rmx){//roomx
jQuery(function($){

var dvcht_tm= "#dvcht_tm_"+rmx;
var dvcht= "#dvcht_"+rmx;
var dvcht_cu= "#dvcht_cu_"+rmx;
var dvchtmsg= "#dvchtmsg_"+rmx;
  
    if($(dvcht_tm).html()=="-"){
      $(dvcht).height(30);
      $(dvcht_tm).html("+");
      $(dvcht_cu).hide();
      $(dvchtmsg).hide();
      $(dvcht).resizable("disable");
      $(dvcht).css('z-index', 9999);
      
    }//if -
    else{
      $(dvcht).height(200);
      $(dvcht_tm).html("-");
      $(dvcht_cu).show();
      $(dvchtmsg).show();
      $(dvcht).resizable("enable");
    }//else +
    
});//jQuery
}//minimizar chat


function restamchT(rmx){//roomx
  var dvcht= document.querySelector

("#dvcht_"+rmx);
if(dvcht.offsetWidth<dvchtc.offsetWidth){
  dvcht.style.height=dvchtc.offsetHeight+"px";
  dvcht.style.width=dvchtc.offsetWidth+"px";
  dvcht.style.left=0;
  dvcht.style.top=0;
}//if pequeño
  else{
    dvcht.removeAttribute("style");
  }//else retorna
}//restaura tamaño


function crrdvichT(rmx){//roomx
  var dvcht= document.querySelector

("#dvcht_"+rmx);
 dvchtc.removeChild(dvcht);
 sktclt.emit("cerrgnrl","general");  
}//cerrar dvicht


function envmsG(ev,rmx){//event,roomx
  ev.preventDefault();
var inchtmsg= document.querySelector

("#inchtmsg_"+rmx);
if(inchtmsg.value!=""){
 sktclt.emit("send message",
             {msg:inchtmsg.value,
      room:rmx});
  //inchtmsg.getAttribute("data-room")
}//if no vacio

inchtmsg.value="";
}//on send msg, del form


sktclt.on('new message', function(data) {
//data{msg,nick,room}
 var dvcht_c= "#dvcht_c_"+data.room;
jQuery(function($){
  $(dvcht_c).append('<b>'+data.nick+":</b> "+
                       data.msg+"<br/>");
  $(dvcht_c).stop().animate(
    {scrollTop:$(dvcht_c)[0].scrollHeight}, 200);
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
  console.log("1mando chtrqs");
  
  sktclt.emit("mnd chtrqs",
              {sktidrcv:prtid,
              sktidmnd:sktclt.id});
  
 alert("chat request, in construction");
  crrinfusR();
}//chat request


function crrinfusR(){
  dvchtc.removeChild(dvinfusr);
}//cerrar inf prf y cht rqst


sktclt.on("recibe chtrqs",function(dt){
  //dt{nmemnd,idrcv,sktidmnd,sktidrcv,roombth}
  console.log("3me dieron chtrqs");
  console.log(dt);
  
var nudiv=document.createElement("div");
nudiv.id="dvchtrqsof";

nudiv.innerHTML='<div id="dvchtrqsof_t">Chat request from '+
  dt.nmemnd+'</div>'+
    '<div id="dvchtrqsof_m" onclick="opnchtrqS(\''+
  dt.roombth+'\',\''+
  dt.sktidmnd+'\')">+</div>'+
    '<div id="dvchtrqsof_x">X</div>';

dvchtc.appendChild(nudiv);
  
});//skcon recibe cht rqs


sktclt.on("espera chtrqs",function(dt){
  //dt{idmnd,idrcv,sktidmnd,sktidrcv,roombth}
  
  //if(dt.sktidmnd==sktclt.id){
    
  console.log("3espera chtrqs");
  console.log(dt);
    
  if(typeof(dvwti)=="undefined"){ 
    
var nudiv=document.createElement("div");
nudiv.id="dvwti";

nudiv.innerHTML='<div id="dvwti_t">Waiting...</div>'+
 '<div id="dvwti_x">X</div>';

dvchtc.appendChild(nudiv);
  }//if dvwti no creado
  //}//if es el que espera
});//skc espera cht rqs


function opnchtrqS(roombthx,sktidmndx){
  
  if(typeof(dvchtrqswth)=="undefined"){
    
var nudiv=document.createElement("DIV");
nudiv.id="dvcht_"+roombthx;
nudiv.classList.add("dvcht");    
 
nudiv.innerHTML='<div id="dvcht_t_'+roombthx+'" class="dvcht_t">'+
    '<div id="dvcht_tnm_'+roombthx+'" class="dvcht_tnm col_tnm">Chat with</div>'+
  '<div id="dvcht_tm_'+roombthx+'" class="dvcht_tm" onclick="mindvchT(\''+roombthx+'\')">-</div>'+
  '<div id="dvcht_tl_'+roombthx+'" class="dvcht_tl" onclick="restamchT(\''+roombthx+'\')">L</div>'+
  '<div id="dvcht_tx_'+roombthx+'" class="dvcht_tx col_tx" onclick="crrdvichT(\''+roombthx+'\')">x</div>'+
  '</div>'+
  '<div id="dvcht_cu_'+roombthx+'" class="dvcht_cu">'+
  '<div id="dvcht_c_'+roombthx+'" class="dvcht_c col_c"></div><div id="dvcht_u_'+roombthx+'" class="dvcht_u col_u"></div>'+
  '</div>'+  
  '<div id="dvchtmsg_'+roombthx+'" class="dvchtmsg"><form id="fmchtmsg_'+roombthx+'" class="fmchtmsg" onsubmit="envmsgR(event,\''+roombthx+'\')">'+
  '<input type="text" id="inchtmsg_'+roombthx+'" class="inchtmsg"'+
  ' data-room="'+roombthx+
  '" placeholder="write your message">'+
  '<button id="btnchtmsg_'+roombthx+'" class="btnchtmsg" type="submit" >send</button>'+
  '</form></div>';    
    
dvchtc.appendChild(nudiv);
    
jQuery(function($){

var dvcht= "#dvcht_"+roombthx;
var dvcht_c= "#dvcht_c_"+roombthx;  
  
var draggableDiv= $(dvcht).draggable();
$(dvcht_c, draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
}).mouseup(function(ev){
  draggableDiv.draggable('enable');
});
  
$(dvcht).resizable();

});//jQuery

  if(sktidmndx){
    sktclt.emit("abr chtrqs",
                {roombth:roombthx,
                 sktidmnd:sktidmndx});
  }//if objeto sktidmndx existe
  console.log("abrio chat request");
  }//if dvchtrqswth no creado
  
}//abir chat request



sktclt.on("aceptd chtrqs",function(dt){
  //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("5aceptada chtrqs");
  console.log(dt);
  
  opnchtrqS(dt.roombth);
  sktclt.emit("usrs pa chtrqs",dt);  
});//skcon acepta chat reqquest


sktclt.on("mete usrs chtrqs",function(dt){
  //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  
    console.log("7mete usrs");
  var dvcht_u= document.getElementById("dvcht_u_"+dt.roombth);
  
    dvcht_u.innerHTML= dt.nmercv+"<br id='brrcv' data-sktid='"+
     dt.sktidrcv+"'/>"+
     dt.nmemnd+"<br id='brmnd' data-sktid='"+dt.sktidmnd+"'/>";
  
});//meter usuario


function envmsgR(ev,roombthx){
  ev.preventDefault();
  
  var inchtmsg= document.querySelector("#inchtmsg_"+roombthx);
  
  if(inchtmsg.value!=""){
 sktclt.emit("send messagecht_r",
             {msg:inchtmsg.value,
      roombth:roombthx});
//inr_msg.getAttribute("data-room")  
}//if no vacio

inchtmsg.value="";
  
}//enviar message privado


sktclt.on("new msgchtrqs",function(dt){
  //dt{msg,nick,room}

jQuery(function($){
  var dvcht_c= "#dvcht_c_"+dt.room;
  
  $(dvcht_c).append('<b>'+dt.nick+":</b> "+dt.msg+"<br/>");
  $(dvcht_c).stop().animate(
    {scrollTop:$(dvcht_c)[0].scrollHeight}, 200);
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
$('#dvjcon', draggableDiv)
  .mousedown(function(ev) {
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


sktclt.on('new messagejue', function(data){
  //data{msg,nick}
  
   if(/bingo/i.test(data.msg)){
     
     dvjcon.innerHTML+="<b>"+data.nick+":</b> "+data.msg+"<br/>"+
       "BINGO, you guessed the word!<br>";
   }else{
     dvjcon.innerHTML+="<b>"+data.nick+":</b> "+data.msg+"<br/>";
   }//else no bingo
  
jQuery(function($){
  $("#dvjcon").stop().animate(
    {scrollTop:$("#dvjcon")[0].scrollHeight}, 100);
});//jquery
});//on receive msg juego






