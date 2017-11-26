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
 conusr+="<tr id=\'"+dat[usrnme].sktid+
   "\' data-usrid='"+usrnme+
   "' onclick='usrprfchtR(this,event)' >"+
  "<td>"+dat[usrnme].user.firstnm+
  " "+dat[usrnme].user.lastnm+"</td>"+
  "<td>"+(dat[usrnme].user.gender||"-")+"</td>"+
  "<td>"+(dat[usrnme].user.age||"-")+"</td>"+
  "<td>"+(dat[usrnme].user.country||"-")+"</td>"+
  "<td>"+(dat[usrnme].user.learning||"-")+"</td>"+
  "<td>"+(dat[usrnme].user.speaks||"-")+"</td>"+
 "</tr>";
}//for

tblusrsbd.innerHTML=conusr;

});//skon usernames table




//====general room

function entrgnrL(rmx){
  
  if(typeof(dvcht_gnrl)=="undefined"){
    
 var nudiv=document.createElement("DIV");
 nudiv.id="dvcht_gnrl";
nudiv.classList.add("dvcht");
    
nudiv.innerHTML='<div id="dvcht_t_gnrl" class="dvcht_t">'+
    '<div id="dvcht_tnm_gnrl" class="dvcht_tnm">General</div>'+
  '<div id="dvcht_tm_gnrl" class="dvcht_tm" onclick="mindvchT(\'gnrl\')">-</div>'+
  '<div id="dvcht_tl_gnrl" class="dvcht_tl" onclick="restamchT(\'gnrl\')">L</div>'+
  '<div id="dvcht_tx_gnrl" class="dvcht_tx" onclick="crrdvchT(\'gnrl\')">x</div>'+
  '</div>'+
  '<div id="dvcht_cu_gnrl" class="dvcht_cu">'+
  '<div id="dvcht_c_gnrl" class="dvcht_c"></div><div id="dvcht_u_gnrl" class="dvcht_u"></div>'+
  '</div>'+  
  '<div id="dvchtmsg_gnrl" class="dvchtmsg"><form id="fmchtmsg_gnrl" class="fmchtmsg" onsubmit="envmsG(event,\'gnrl\')">'+
  '<input type="text" id="inchtmsg_gnrl" class="inchtmsg" autocorrect="off" autocomplete="off"'+
  ' data-room="'+"gnrl"+
  '" placeholder="write your message">'+
  '<button id="btnchtmsg_gnrl" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+
  '<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<b><i class="fa fa-smile-o" aria-hidden="true" style="color:black"></i></b>'+
    '</button>'+
  '</form></div>';

dvconcht.appendChild(nudiv);
//juntarlo al room: gnrl !!!
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
  
  inchtmsg_gnrl.addEventListener("keydown",tyP);

});//jQuery
  }//if no dvicht
}//entrar al general room


sktclt.on("mndusrgnrl",function(dt){
  //dt{usrsgnrl,chtgnrl,sktid} 
  var cntgnrl=Object.keys(dt.usrsgnrl).length;
  spchtcnt_gnrl.innerHTML= cntgnrl!=0? cntgnrl: ""; 
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
    
 dvcht_c_gnrl.scrollTo(0,dvcht_c_gnrl.scrollHeight);
    
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
if(dvcht.offsetWidth<dvconcht.offsetWidth){
  dvcht.style.height=dvconcht.offsetHeight+"px";
  dvcht.style.width=dvconcht.offsetWidth+"px";
  dvcht.style.left=0;
  dvcht.style.top=0;
}//if pequeño
  else{
    dvcht.removeAttribute("style");
  }//else retorna
}//restaura tamaño


function crrdvchT(rmx){//roomx
  var dvcht= document.querySelector("#dvcht_"+rmx);
 dvconcht.removeChild(dvcht);
 sktclt.emit("cerr room",rmx);  
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
  
  if(!document.hasFocus()){
    favicon.href="https://cdn.glitch.com/55f963f5-bf15-449c-b526-e46a7cd2b96f%2Fbstlkn.ico?1511655370091";
  }//if not focus
  
  
 var dvcht_c= "#dvcht_c_"+data.room;
jQuery(function($){
  $(dvcht_c).append('<b>'+data.nick+":</b> "+
                       data.msg+"<br/>");
  $(dvcht_c).stop().animate(
    {scrollTop:$(dvcht_c)[0].scrollHeight}, 200);
});//jQuery
});//on receive msg

window.onfocus=function(){
  if(favicon.href!="https://cdn.glitch.com/55f963f5-bf15-449c-b526-e46a7cd2b96f%2Fbstlk.ico?1511655349997")
  favicon.href="https://cdn.glitch.com/55f963f5-bf15-449c-b526-e46a7cd2b96f%2Fbstlk.ico?1511655349997";
}//tornar el favicon a la normalidad



//agregado cuando se crea
function tyP(){
  sktclt.emit("typing gnrl");
  inchtmsg_gnrl.removeEventListener("keydown",tyP);
  setTimeout(function(){
    inchtmsg_gnrl.addEventListener("keydown",tyP);
  },1000);
  
}//typing

sktclt.on("who type",function(dt){
  //dt=user.firstnm
  //console.log(dt+" is typing");
  
  var nudiv= document.createElement("div");
nudiv.id="dvtyp"
  
  nudiv.innerHTML="<b>"+dt+"</b>"+"<span id='sptyp'> is typing...</span>"+'<i class="fa fa-pencil" aria-hidden="true"></i>';
  
dvcht_cu_gnrl.appendChild(nudiv);

setTimeout(function(){
 dvcht_cu_gnrl.removeChild(nudiv);
},1000)
  
});//who type



//====inf usr

function nooP(){}//no operations, for swap functions

function usrprfchtR(ele,ev){
  
 if(typeof(dvinfusr)=="undefined"){
   
var nuedvinfusr=document.createElement("DIV");
nuedvinfusr.id="dvinfusr";
nuedvinfusr.style="position:fixed;"+
"left:"+ev.clientX+"px;"+
"top:"+ev.clientY+"px";
   
  nuedvinfusr.innerHTML='<div id="dvinfprfcht">'+
    '<li id="liprf'+ele.id
  +'" onclick="prfinF(this)">Profile</li>'+
    '<li id="lichtrqs'+ele.id+
  '" onclick="chtrqsT(this)">Chat Request</li>'+
    '</div>'+
    '<div id="dvcrrprfcht" onclick="crrinfusR()">x</div>';
  
 dvconcht.appendChild(nuedvinfusr);
 }//if no existe: crea
}//profile y chat request del user


function prfinF(ele){
  
  alert("in construction, "+ele.id);
  
}//info profile


function chtrqsT(ele){
  
  var prtid=ele.id.substr(8,ele.id.length);
  console.log("1mando chtrqs");
  
  sktclt.emit("mnd chtrqs",
              {sktidrcv:prtid,
              sktidmnd:sktclt.id});
  
 
  crrinfusR();
}//chat request


function crrinfusR(){
  dvconcht.removeChild(dvinfusr);
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

dvconcht.appendChild(nudiv);
  
});//skcon recibe cht rqs


sktclt.on("espera chtrqs",function(dt){
  //dt{idmnd,idrcv,sktidmnd,sktidrcv,nmercv,roombth}
  
  //if(dt.sktidmnd==sktclt.id){
    
  console.log("3espera chtrqs");
  console.log(dt);
    
  if(typeof(dvwti)=="undefined"){ 
    
var nudiv=document.createElement("div");
nudiv.id="dvwti";

nudiv.innerHTML='<div id="dvwti_t">Waiting for '+dt.nmercv+'...</div>'+
 '<div id="dvwti_x">X</div>';

dvconcht.appendChild(nudiv);
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
  '<div id="dvcht_tx_'+roombthx+'" class="dvcht_tx col_tx" onclick="crrdvchT(\''+roombthx+'\')">x</div>'+
  '</div>'+
  '<div id="dvcht_cu_'+roombthx+'" class="dvcht_cu">'+
  '<div id="dvcht_c_'+roombthx+'" class="dvcht_c col_c"></div><div id="dvcht_u_'+roombthx+'" class="dvcht_u col_u"></div>'+
  '</div>'+  
  '<div id="dvchtmsg_'+roombthx+'" class="dvchtmsg"><form id="fmchtmsg_'+roombthx+'" class="fmchtmsg" onsubmit="envmsgR(event,\''+roombthx+'\')">'+
  '<input type="text" id="inchtmsg_'+roombthx+'" class="inchtmsg" autocorrect="off" autocomplete="off"'+
  ' data-room="'+roombthx+
  '" placeholder="write your message...">'+
  '<button id="btnchtmsg_'+roombthx+'" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+
  '<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<i class="fa fa-smile-o" aria-hidden="true"></i>'+
    '</button>'+
  '</form></div>';    
    
dvconcht.appendChild(nudiv);
    
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
  //dt{nmemnd,nmercv,sktidrcv,sktidmnd,roombth,chtprv}
  
    console.log("7mete usrs");
  //console.log(dt);
  var dvcht_u= document.getElementById("dvcht_u_"+dt.roombth);
  
    dvcht_u.innerHTML= dt.nmercv+"<br id='brrcv' data-sktid='"+
     dt.sktidrcv+"'/>"+
     dt.nmemnd+"<br id='brmnd' data-sktid='"+dt.sktidmnd+"'/>";
  
  var licht="";

for(var msgcht in dt.chtprv){
 licht+=dt.chtprv[msgcht]+"<br>";
}//for

var dvcht_c= document.getElementById("dvcht_c_"+dt.roombth);

dvcht_c.innerHTML=licht;
  
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


sktclt.on("dejar prv",function(dt){
  crrdvchT(dt);
});//deja el privado



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



function crtgmE(){

  if(typeof(dvcrtgme)=="undefined"){
  
var nudiv=document.createElement("DIV");
 nudiv.id="dvcrtgme";

nudiv.innerHTML='<div id="dvtitoptgme">'+
 '<div id="dvtitoptgmenme">Game Options</div>'+
 '<div id="dvtitoptgme_x">X</div></div>'+

 '<div id="dvtypgme">'+
 '<span>Type of game:</span>'+
 '<select id="sltypgme">'+
 '<option id="optetw">Explain The Word</option>'+
 '<option id="optoth">Others, in future</option>'+
 '</select></div>'+

 '<div style="display:inline-block">'+
 '<span>Select word list:</span><br>'+
 '<select id="sllst">'+
 '<option id="opt10">10 words</option>'+
 '<option id="opt20">20 words</option>'+
 '<option id="optld">load list, in future</option>'+
 '</select></div>'+

 '<div style="display:inline-block;text-align:center">'+
 '<span>Nro of players:</span><br>'+
 '<select id="slnroply">'+
 '<option id="opt2">2</option>'+
 '<option id="opt3">3</option>'+
 '<option id="opt4">4</option>'+
 '<option id="opt5">5</option>'+
 '<option id="opt6">6</option>'+
 '<option id="opt8">8</option>'+
 '</select></div><br>'+

 '<div id="dvrdygme">'+
 '<input type="button" id="btrdygme" value="Create" onclick="rdygmE()">'+
 '</div></div>';

dvcongme.appendChild(nudiv);
  }//if dvcrtgme no existe
    
}//crear tipo de juego



function rdygmE(){

var nudiv=document.createElement("DIV");
nudiv.id="dvgmebar_1";

nudiv.innerHTML='<div>'+
 sltypgme.options[sltypgme.selectedIndex].value+
 '</div>'+
 '<div>'+
 sllst.options[sllst.selectedIndex].value+
 '</div>'+
 '<div>1/'+//nrojug/totjug
slnroply.options[slnroply.selectedIndex].value
 '</div>';

dvcongme.appendChild(nudiv);

dvcongme.removeChild(dvcrtgme);  

crtgaM();
  
}//ready game options


function crtgaM(){
  
   if(typeof(dvjue)=="undefined"){
     
var nudivj=document.createElement("DIV");
nudivj.id="dvjue";

nudivj.innerHTML='<div id="dvjtit" draggable="true">'+
'<div id="dvjnm">'+
  '<div id="dvjnmtit">Explain The Word</div>'+
  '<div id="dvjnmmit" onclick="restamjuE()">L</div>'+
  '<div id="dvjnmcrr" onclick="crrjuE()">X</div>'+
  '</div>'+
'<div id="dvjexp">Explains: <span>wordX</span'+
'><span id="sptmr">00</span></div></div>'+
'<div id="dvjcu">'+
'<div id="dvjcon"></div>'+
'<div id="dvjuse">Users</div>'+
'</div><div id="dvjmsg">'+
'<form id="fmjmsg" class="fmchtmsg" onsubmit="envmsgJ(event)">'+
'<input type="text" id="injmsg" class="inchtmsg" placeholder="write your text...">'+
'<button id="btnjsndm" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+  
'<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<i class="fa fa-smile-o" aria-hidden="true"></i>'+
    '</button>'+  
'</form></div></div>';

  dvcongme.appendChild(nudivj);
    
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
  
  if(dvjue.offsetWidth<dvcongme.offsetWidth){
    
  dvjue.style.height=dvcongme.offsetHeight+"px";
  dvjue.style.width=dvcongme.offsetWidth+"px";
  dvjue.style.left=0;
  dvjue.style.top=0;
  }//if pequeño
  else{
    dvjue.removeAttribute("style");
  }//else retorna
}//restaurar tamaño del juego


function crrjuE(){
  dvcongme.removeChild(dvjue);
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


//----------complementos

function selemJ(){
  alert("emojies in construction, write :smile: for :)\n\nlist: https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json");
}//select emjoy



