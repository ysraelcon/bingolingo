//despues de socket.io/socket.io.js

//conexión socket
var sktclt=io.connect();


//====entra al chat
function entrchT(){
  
 sktclt.emit("userva",sktclt.id);
}//click tab chat


//llena tabla users chat
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


//---------

var rooms={"gnrl":"General", "eng":"English",
           "spa":"Spanish","fra":"French",
"rus":"Russian","por":"Portuguese",
"ita":"Italian","deu":"German",
"ara":"Arabic","zho":"Chinese",
"kor":"Korean","ind":"Indonesian",
"jpn":"Japanese","hin":"Hindi",
"swe":"Swedish","tur":"Turkish",
"ben":"Bengali","slk":"Slovak",
"mul":"MULTILINGUAL"
          };//rooms



//entrar language room, from datalist
function goiN(){
  
  for(var opt in dtlstroom.options){
  if(dtlstroom.options[opt].value== inlstroom.value){
    var roomf= dtlstroom.options[opt].id.slice(3,6);
    break;
  }//if
}//for

 
 if(!document.getElementById("sprm_"+roomf)){ 
  
var sprm= document.createElement("span");
sprm.id="sprm_"+roomf;
sprm.setAttribute("class","spchtrm");
sprm.setAttribute("onclick","entrrooM(\'"+roomf+"\')");  
entrrooM(roomf);


sprm.innerHTML= rooms[roomf]+' <span id="spchtcnt_'+roomf+ '" class="spchtcnt"></span><i class="fa fa-comments-o" aria-hidden="true"></i>';

dvchtrc.appendChild(sprm);
 }//if  no esta lo crea
  
}//goiN room



//entrar language room, click on name
function entrrooM(rmx){
    
  var dvcht_= document.getElementById("dvcht_"+rmx);
  
  if(!dvcht_){
    
 var nudiv=document.createElement("DIV");
 nudiv.id="dvcht_"+rmx;
nudiv.classList.add("dvcht");
    
nudiv.innerHTML='<div id="dvcht_t_'+rmx+'" class="dvcht_t">'+
    '<div id="dvcht_tnm_'+rmx+'" class="dvcht_tnm">'+rooms[rmx]+'</div>'+
  '<div id="dvcht_tm_'+rmx+'" class="dvcht_tm" onclick="mindvchT(\''+rmx+'\')">-</div>'+
  '<div id="dvcht_tl_'+rmx+'" class="dvcht_tl" onclick="restamchT(\''+rmx+'\')">L</div>'+
  '<div id="dvcht_tx_'+rmx+'" class="dvcht_tx" onclick="crrdvchT(\''+rmx+'\')">x</div>'+
  '</div>'+
  '<div id="dvcht_cu_'+rmx+'" class="dvcht_cu">'+
  '<div id="dvcht_c_'+rmx+'" class="dvcht_c"></div><div id="dvcht_u_'+rmx+'" class="dvcht_u">'+
    '<div id="dvcht_u_nm_'+rmx+'" class="dvcht_u_nm"></div>'+
    '<div id="dvcht_u_bts_'+rmx+'" class="dvcht_u_bts">'+          
    '<input type="button" value="_"'+
   ' onclick="empbuT()"></div>'+
  '</div>'+
  '</div>'+  
  '<div id="dvchtmsg_'+rmx+'" class="dvchtmsg"><form id="fmchtmsg_'+rmx+'" class="fmchtmsg" onsubmit="envmsG(event,\''+rmx+'\')">'+
  '<input type="text" id="inchtmsg_'+rmx+'" class="inchtmsg" autocorrect="off" autocomplete="off"'+
  ' data-room="'+rmx+'" placeholder="write your message">'+
  '<button id="btnchtmsg_'+rmx+'" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+
  '<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<b><i class="fa fa-smile-o" aria-hidden="true" style="color:black"></i></b>'+
    '</button>'+
  '</form></div>'+
    
  '</div>';

dvconcht.appendChild(nudiv);
//juntarlo al room: gnrl !!!
sktclt.emit("open room",rmx);

jQuery(function($){

var draggableDiv = 

$('#dvcht_'+rmx).draggable();
  
$('#dvcht_c_'+rmx, draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDiv.draggable('enable');
});//mouseup
  
  $('#dvdct_'+rmx, draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDiv.draggable('enable');
});//mouseup
  
$('#dvcht_'+rmx).resizable();
  
  var inchtmsg_= document.getElementById("inchtmsg_"+rmx);
  
  inchtmsg_.addEventListener("keydown",
                        function(){
        tyP(inchtmsg_);
  });//addeventlistener keydown tyP

});//jQuery
  }//if no dvicht
  
}//entrrooM



//users in room
sktclt.on("mndusrroom",function(dt){
  //dt{usrsroom,chtroom,sktid,room} 
    
  var usrsg="";
  
  for(var nombr in dt.usrsroom){
    usrsg+=dt.usrsroom[nombr]+"<br>";
  }//for
 
  var dvcht_u_= document.getElementById("dvcht_u_nm_"+dt.room);
  
 dvcht_u_.innerHTML="";
 dvcht_u_.innerHTML=usrsg;
    
  if(dt.sktid==sktclt.id){
    
   var dvcht_c_= document.getElementById("dvcht_c_"+dt.room); 
    
  var licht=dvcht_c_.innerHTML;
//15 lines of chat
  for(var msgcht in dt.chtroom){
    licht+=dt.chtroom[msgcht]+"<br>";
  }//for
 dvcht_c_.innerHTML=licht;
    
 dvcht_c_.scrollTo(0,dvcht_c_.scrollHeight);
    
  }//if es el que llega
  
});//skon mndusrroom



sktclt.on("actlz rooms",function(dt){
  //console.log(document.getElementById("sprm_"+dt.room));
  if(!document.getElementById("sprm_"+dt.room)){ 
  
var sprm= document.createElement("span");
sprm.id="sprm_"+dt.room;
sprm.setAttribute("class","spchtrm");
sprm.setAttribute("onclick","entrrooM(\'"+dt.room+"\')");  
//entrrooM(roomf);


sprm.innerHTML= rooms[dt.room]+
  ' <span id="spchtcnt_'+dt.room+
  '" class="spchtcnt"></span><i class="fa fa-comments-o" aria-hidden="true"></i>';

dvchtrc.appendChild(sprm);
 }//if  no esta lo crea
  
  //dt{usrsroom,chtroom,sktid,room} 
  var cntusrs=Object.keys(dt.usrsroom).length;
  var spchtcnt_= document.getElementById("spchtcnt_"+dt.room);
  spchtcnt_.innerHTML= cntusrs!=0? cntusrs: ""; 
   
});//skcl actlz rooms




//minimizar ventana del chat
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
}//mindvchT



//restaurar tamaño del chat
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
}//restamchT



//cerrar chat
function crrdvchT(rmx){//roomx
  var dvcht= document.querySelector("#dvcht_"+rmx);
 dvconcht.removeChild(dvcht);
 sktclt.emit("cerr room",rmx);  
}//crrdvchT



//botones chat, como zumbido, bell, volume-up

function empbuT(){
  alert("Empty Button :)");
}//empbuT


//definicion wordnik wordnet.3.0
function defwrdniK(wrd){
      
    var hk="https://cors-anywhere.herokuapp.com/";     
      
    var url1="http://api.wordnik.com:80/v4/word.json/";
    
    //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
    var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
        //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
        
      
  var xhr=new XMLHttpRequest();
    
  xhr.open("GET", hk+url1+wrd+url2, true);
    
         
    dvrsldct.innerHTML ="loading...";    
      
  xhr.onload = function() {
          
      //console.log(this.response);
      var resp=JSON.parse(this.response);//matriz objetos
     
     var list="";
     
     for(var pr in resp){
       
      var relwrds="";
      
      //console.log(resp[pr].relatedWords[0].words)
      
      if(resp[pr].relatedWords[0].words)
      resp[pr].relatedWords[0].words.forEach(function(v){
relwrds+=v+", "
});//for each
       
       list+=resp[pr].partOfSpeech+". "+
         resp[pr].text+"<br>"+
         "["+relwrds+"]<br>";
     }//for
     
     dvrsldct.innerHTML=list;
    
  };//onload

    
    xhr.send();
      
}//.defwrdniK
    
    
    
//definicion yandex
function defyaN(wrd){
  
  var apik="dict.1.1.20171201T200832Z.77f7f25aec7d41b6.7bf840f1b594d83a20e756ec3117a3f6393466b0";
  var url1="https://dictionary.yandex.net/api/v1/dicservice.json/lookup?";
  
  var lngfrm=inlstlngfrm.value||"en";
  var lngto=inlstlngto.value||"es";
  
  var url2="key="+apik+"&text="+wrd+"&lang="+
           lngfrm+"-"+lngto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
  
    
  dvrsldct.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    
    var resp=JSON.parse(this.response);
    
    
    var rsl="";

for(var i in resp.def){

 rsl+= resp.def[i].pos+". "+
   resp.def[i].text+" / "+
   resp.def[i].ts+"<br>";
  
 for(var j in resp.def[i].tr){
   rsl+="  "+resp.def[i].tr[j].text+
       "<br> syn: ";
  for(var l in resp.def[i].tr[j].syn){
    rsl+=resp.def[i].tr[j].syn[l].text+", ";
  }//for l
  
  rsl+="<br> mean: ";
  
  for(var k in resp.def[i].tr[j].mean){
   rsl+=resp.def[i].tr[j].mean[k].text+", ";
}//for k
rsl+="<br>";
}//for j
}//for i
    
    dvrsldct.innerHTML=rsl;
   
  };//onload
  
}//.defyaN



//traducir frase
function trdphR(phr){
  
  var apik="trnsl.1.1.20151020T150119Z.a9c85d2a39f6fe5d.c34e526096f815916127444ce3d86ab82e945c35";
  var url1="https://translate.yandex.net/api/v1.5/tr.json/translate?";
  
  var lngfrm=inlstlngfrm.value||"en";
  var lngto=inlstlngto.value||"es";
  
  var url2="key="+apik+"&text="+phr+"&lang="+
           lngfrm+"-"+lngto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
    
  
  dvrsldct.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    //{code,lang,text}
    var resp=JSON.parse(this.response);
    
    dvrsldct.innerHTML=resp.text;
   
  };//onload
  
  
}//.trdphR

//........


//enviar mensaje
function envmsG(ev,rmx){//event,roomx
  ev.preventDefault();
var inchtmsg= document.querySelector

("#inchtmsg_"+rmx);
if(inchtmsg.value!=""){
 sktclt.emit("send message room",
             {msg:inchtmsg.value,
      room:rmx});
  //inchtmsg.getAttribute("data-room")
}//if no vacio

inchtmsg.value="";
}//envmsG



//recibe mensaje en chat
sktclt.on('new message room', function(data) {
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
});//skcl new message room



//cambia icono de nuevo mensaje
window.onfocus=function(){
  if(favicon.href!="https://cdn.glitch.com/55f963f5-bf15-449c-b526-e46a7cd2b96f%2Fbstlk.ico?1511655349997")
  favicon.href="https://cdn.glitch.com/55f963f5-bf15-449c-b526-e46a7cd2b96f%2Fbstlk.ico?1511655349997";
}//tornar el favicon a la normalidad



//quien escribe, en evento attached
function tyP(inchtmsgf){
  sktclt.emit("typing",
             {room: inchtmsgf.getAttribute("data-room")});
  inchtmsgf.removeEventListener("keydown",tyP);
  setTimeout(function(){
    inchtmsgf.addEventListener("keydown",tyP);
  },1000);
  
}//tyP typing



sktclt.on("who type",function(dt){
  //dt{fistnm,room}
  //console.log(dt+" is typing");
  
  var nudiv= document.createElement("div");
nudiv.id="dvtyp_"+dt.room;
nudiv.setAttribute("class","dvtyp"); 
  
  nudiv.innerHTML="<b>"+dt.firstnm+"</b>"+"<span  class='sptyp'> is typing...</span>"+'<i class="fa fa-pencil" aria-hidden="true"></i>';

  var dvcht_cu= document.getElementById("dvcht_cu_"+dt.room);
  
dvcht_cu.appendChild(nudiv);

setTimeout(function(){
 dvcht_cu.removeChild(nudiv);
},1000)
  
});//skcl who type



//====inf usr

function nooP(){}//no operations, for swap functions

//cuadro, profile, chat request, al clicar user
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
}//usrprfchtR



function prfinF(ele){
  
  alert("in construction, "+ele.id);
  
}//info profile


//eviarle chat request
function chtrqsT(ele){
  
  var prtid=ele.id.substr(8,ele.id.length);
  console.log("1mando chtrqs");
  
  sktclt.emit("mnd chtrqs",
              {sktidrcv:prtid,
              sktidmnd:sktclt.id});
  
 
  crrinfusR();
}//chtrqsT


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
  
});//skclon recibe chtrqs



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
});//skcl espera chtrqs



//abre chat request
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
  
}//opnchtrqS



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
  
});//skcl meter usrs chtrqs



//enviar msg chat privado
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
  
}//envmsgR cht prv


sktclt.on("new msgchtrqs",function(dt){
  //dt{msg,nick,room}

jQuery(function($){
  var dvcht_c= "#dvcht_c_"+dt.room;
  
  $(dvcht_c).append('<b>'+dt.nick+":</b> "+dt.msg+"<br/>");
  $(dvcht_c).stop().animate(
    {scrollTop:$(dvcht_c)[0].scrollHeight}, 200);
});//jQuery
});//skcl new msgchtrqs msg privado


sktclt.on("dejar prv",function(dt){
  crrdvchT(dt);
});//deja el privado



//=====juego


//opciones de juego para crearlo
function crtgmE(){
 console.log("1opciones de juego");
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
 '<input type="button" id="btrdygme" value="Create" onclick="solgmE()">'+
 '</div></div>';

dvcongme.appendChild(nudiv);
  }//if dvcrtgme no existe
    
}//crtgmE opciones



//solicitar juego
function solgmE(){
 var typgme= sltypgme.options[sltypgme.selectedIndex].value;
 var liswrd= sllst.options[sllst.selectedIndex].value;
 var nroply= slnroply.options[slnroply.selectedIndex].value;
 
 dvcongme.removeChild(dvcrtgme);  
  
 sktclt.emit("solicitar game",
         {typgme: typgme,
          liswrd: liswrd,
          nroply: nroply});
}//solgmE



sktclt.on("crear juego",function(dt){
//dt{nrogme,typgme,liswrd,nroply}

 console.log("2crear juego");
 console.log(dt);
  
 crtgaM(dt.nrogme,dt.typgme,
       dt.liswrd,dt.nroply); 
});//skcl crear juego



sktclt.on("los demas barjue",function(dt){
 //dt{nrogme,typgme,liswrd,nroply}

  console.log("los demas barjue");
  console.log(dt);
 barjuE(dt.nrogme,dt.typgme,
        dt.liswrd,dt.nroply);
});//skcl los demas barjue



//crear barra juego, por alguien
function barjuE(rmjf,nmejuef,
                lisjuef,nroplyf){

console.log("crear barra de juego");

var nudiv=document.createElement("DIV");
nudiv.id="dvgmebar_"+rmjf;
  
nudiv.setAttribute("class","dvgmebar");
nudiv.setAttribute("onclick","jnspC(\'"+rmjf+"\',\'"+
                   nmejuef+"\',\'"+
                   lisjuef+"\',\'"+
                   nroplyf+"\')");

nudiv.setAttribute("data-idgm",rmjf);

nudiv.innerHTML= '<div id="dvbarjuenm">'+
 nmejuef+'</div>'+
 '<div id="dvbarjuelis">'+lisjuef+
 '</div>'+
 '<div id="dvbarjuenroply>1/'+ //nrojug/totjug
'<span id="spnroply">'+ nroplyf+
  '</span>'+'</div>';

dvcongme.appendChild(nudiv);

}//barjuE



//mostrar cuadro, join, spectate
function jnspC(rmj,nmejuef,lisjuef,nroplyf){
  
  console.log("juntarse juego");
  crtgaM(rmj,nmejuef,lisjuef,nroplyf);
}//juntarse o spectate



//crear ventana juego
function crtgaM(rmjf,nmejuef,lisjuef,nroplyf){
  console.log("2creando vent juego");
  
   if(typeof(dvjue)=="undefined"){
     
var nudivj=document.createElement("DIV");
nudivj.id="dvjue";

nudivj.innerHTML='<div id="dvjtit" draggable="true">'+
'<div id="dvjnm">'+
  '<div id="dvjnmtit">Explain The Word</div>'+
  '<div id="dvjnmmit" onclick="restamjuE()">L</div>'+
  '<div id="dvjnmcrr" onclick="crrjuE(\''+rmjf+'\')">X</div>'+
  '</div>'+
  
'<div id="dvjexp">Explains: <span id="spwrdtogss">wordX</span'+
'><span id="sptmr">00</span></div></div>'+
  
'<div id="dvjcu">'+
'<div id="dvjcon"></div>'+
'<div id="dvjuse">'+
  '<div id="dvjue_u_nm_'+rmjf+'" class="dvjue_u_nm"></div>'+
    '<div id="dvjue_u_bts_'+rmjf+'" class="dvjue_u_bts">'+          
    '<input type="button" value="_"'+
   ' onclick="empbuT()"></div>'+
  '</div>'+
'</div>'+
  
  
  '<div id="dvjmsg">'+
  
'<form id="fmjmsg" class="fmchtmsg" onsubmit="envmsgJ(event)">'+
'<input type="text" id="injmsg" class="inchtmsg" placeholder="write your text..." data-room="'+rmjf+'">'+
'<button id="btnjsndm" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+  
'<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<i class="fa fa-smile-o" aria-hidden="true"></i>'+
    '</button>'+  
'</form></div>'+
     
     '</div>';;

  dvcongme.appendChild(nudivj);
    
  sktclt.emit("entroomj",
              {nrogme:rmjf, //idjue
               typgme:nmejuef,
               liswrd:lisjuef,
               nroply:nroplyf});
 
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
};//crtgaM




sktclt.on("mndusrjue",function(dt){
  /*dt{usrjue{usrid[fn,sktid]}},
  nrogme,typgme,liswrd,nroply}*/
  
  console.log("4recibe user pal juego");
  console.log(dt);
  
 var usrj="";

for(var nom in dt.usrjue){
 usrj+= '<div id="dvjuepnt_'+nom+'" class="dvjuepnt">0</div>'+ 
          dt.usrjue[nom][0]+"<br>";
}//for

var dvjue_u_nm= document.getElementById("dvjue_u_nm_"+dt.nrogme);
  
dvjue_u_nm.innerHTML="";
dvjue_u_nm.innerHTML=usrj;
  
 /*   
  if(Object.keys(dt.usrjue).length==dt.nroply){
    //start game in 10 seconds from server!!!
    alert("start game!");
    sktclt.emit("start game",dt);
  }//if, enviar emit socket start game
  */
});//mndusrjue



sktclt.on("ya comenzo jue",function(dt){
//dt{msg} 

alert(dt.msg);
});//skcl ya comenzo juego, esta completo
     
          

sktclt.on("el del turno",function(dt){
  //dt{wrd}
  console.log("te toca explicar");
  spwrdtogss.innerHTML=dt.wrd;
});//skcl el del turno



sktclt.on("corre reloj",function(dt){
  //dt{tmp}
  
  sptmr.innerHTML=dt.tmp;
  
});//skcl empieza a correr el reloj



sktclt.on("los que adivinan",function(dt){
  //dt{usrexpl}
  console.log("a adivinar!");
  spwrdtogss.innerHTML=dt.usrexpl;
  dvjcon.innerHTML="";
});//skcl los que adivinan



sktclt.on("no se adivino",function(dt){
//dt{wrdtogss}
  console.log("no se adivino");
 dvjcon.innerHTML+="The word was <b>"+
         dt.wrdtogss+"</b><br>";
  
});//skcl si no se adivina



sktclt.on("actualiza puntaje",function(dt){
 //dt{usrid,pntply}

var dvjuepnt= document.getElementById("dvjuepnt_"+dt.usrid);

dvjuepnt.innerHTML=dt.pntply;
});//skcl actualiza puntaje



sktclt.on("quien gano",function(dt){
//dt{wnrnme}

dvjcon.innerHTML="The winner is: <b>"+
              dt.wnrnme+"</b>!<br>";

});//skcl quien gano




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


function crrjuE(rmj){
  dvcongme.removeChild(dvjue);
  sktclt.emit("slrjue",{room:rmj});
}//cerrar juego



function envmsgJ(ev){
  ev.preventDefault();

if(injmsg.value!=""){
 sktclt.emit("send messagejue",
             {msg:injmsg.value,
        nrogme:injmsg.getAttribute("data-room")});
}//if no vacio

injmsg.value="";
}//on send msg jue, del form envmsgJ(event)



sktclt.on('new messagejue', function(dt){
  //dt{msg,nrogme,nick,guess}
  
   if(dt.guess){
     
     dvjcon.innerHTML+="<b>"+dt.nick+":</b> "+
       dt.msg+"<br/>"+
       "BINGO, you guessed the word!<br>";
     sktclt.emit("10 seg",{nrogme: dt.nrogme});
     
   }else{
     dvjcon.innerHTML+="<b>"+dt.nick+":</b> "+
       dt.msg+"<br/>";
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


function sndrpT(){
  
sktclt.emit("reporte",{
           tit:inrpttit.value,
           rpt:tarpt.value});
alert("Thanks for your report");
crrrpT();  

}//enviar reporte



