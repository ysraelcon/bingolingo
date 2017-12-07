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
          };

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
  
}//select room from datalist



//====general room

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
    '<input type="button" value="dict"'+
   ' onclick="mstdcT(\''+rmx+'\')" id="btdct_'+rmx+'"></div>'+
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
  
  
  '<div id="dvdct_'+rmx+'" class="dvdct">'+
  
  '<form onsubmit="event.preventDefault()">'+
'      <input type="text" id="inwrd_'+rmx+'"'+
'   placeholder="word...">'+
'      <input type="submit"'+
'    value="dictENG"'+
'    onclick="defwrdniK(inwrd_'+rmx+'.value,\''+rmx+'\')">'+
'      <input type="button" value="X"'+
'             onclick="inwrd_'+rmx+'.value=\'\'">  '+
'        </form>'+
'      '+
'      '+
'      <input type="button"'+
'   value="Translate"'+
'   onclick="trdphR(inwrd_'+rmx+'.value,\''+rmx+'\')">'+
'   '+
'   <input list="dtlstlng" id="inlstlngfrm"'+
'    placeholder="from...">'+
'  <input list="dtlstlng" id="inlstlngto"'+
'    placeholder="to...">'+
''+
'<datalist id="dtlstlng">'+
'<option value="en">English</option>'+
'<option value="es">Spanish</option>'+
'<option value="fr">French</option>'+
'<option value="ru">Russian</option>'+
'<option value="pt">Portuguese</option>'+
''+
'<option value="it">Italian</option>'+
'<option value="de">German</option>'+
'<option value="ar">Arabic</option>'+
'<option value="zh">Chinese</option>'+
'<option value="ko">Korean</option>'+
''+
'<option value="id">Indonesian</option>'+
'<option value="ja">Japanese</option>'+
'<option value="hi">Hindi</option>'+
'<option value="sv">Swedish</option>'+
'<option value="tr">Turkish</option>'+
'</datalist>'+
'      '+
'      <input type="button" value="dictYandex"'+
' onclick="defyaN(inwrd_'+rmx+'.value,\''+rmx+'\')">'+
'      '+
'      <div id="dvrsldct_'+rmx+'"'+
'           class="dvrsldct"></div>'+
  
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
  
$('#dvcht_'+rmx).resizable();
  
  var inchtmsg_= document.getElementById("inchtmsg_"+rmx);
  
  inchtmsg_.addEventListener("keydown",tyP);

});//jQuery
  }//if no dvicht
}//entrar al general room



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
  
});//skon mandaron el usuario

sktclt.on("actlz rooms",function(dt){
  console.log(document.getElementById("sprm_"+dt.room));
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
  
  
});


//----complementarias vent cht

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

function mstdcT(rmf){
      
      var btdct_= document.getElementById("btdct_"+rmf);
      var dvdct_= document.getElementById("dvdct_"+rmf);
      
      if(btdct_.style.color!=="green"){
       dvdct_.style.height="70%";
       btdct_.style.color="green";
      }else{
        dvdct_.removeAttribute("style");
        btdct_.removeAttribute("style");
      }//else
        
    }//.mostrar dictionary


function defwrdniK(wrd,rmx){
      
    var hk="https://cors-anywhere.herokuapp.com/";     
      
    var url1="http://api.wordnik.com:80/v4/word.json/";
    
    //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
    var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
        //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
    
    
      
  var xhr=new XMLHttpRequest();
    
  xhr.open("GET", hk+url1+wrd+url2, true);
    
    var dvrsldct_= document.getElementById("dvrsldct_"+rmx);
       
    dvrsldct_.innerHTML ="loading...";    
      
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
     
     dvrsldct_.innerHTML=list;
    
  };//onload

    
    xhr.send();
      
}//.definicion wordnik wordnet.3.0
    
    
    
    function defyaN(wrd,rmx){
  
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
  
  var dvrsldct_= document.getElementById("dvrsldct_"+rmx);
  
  dvrsldct_.innerHTML="loading...";
  
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
    
    dvrsldct_.innerHTML=rsl;
   
  };//onload
  
}//.definir de yandex

function trdphR(phr,rmx){
  
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
  
  var dvrsldct_= document.getElementById("dvrsldct_"+rmx);
  
  dvrsldct_.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    //{code,lang,text}
    var resp=JSON.parse(this.response);
    
    dvrsldct_.innerHTML=resp.text;
   
  };//onload
  
  
}//.traduccion



//........


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
}//on send msg, del form


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

var roomj="juex";





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
 '<input type="button" id="btrdygme" value="Create" onclick="crtgaM()">'+
 '</div></div>';

dvcongme.appendChild(nudiv);
  }//if dvcrtgme no existe
    
}//crear tipo de juego



function rdygmE(roomf,nmejuef,lisjuef,nroplyf){
var nrogme=roomf;
var nudiv=document.createElement("DIV");
nudiv.id="dvgmebar_1";
nudiv.setAttribute("onclick","jnspC(\'"+nrogme+"\',\'"+
                   nmejuef+"\',\'"+
                   lisjuef+"\',\'"+
                   nroplyf+"\')");
nudiv.setAttribute("data-idgm",nrogme)

nudiv.innerHTML='<div id="dvbarjuenm">'+
 nmejuef+
 '</div>'+
 '<div id="dvbarjuelis">'+
 lisjuef+
 '</div>'+
 '<div id="dvbarjuenroply>1/'+//nrojug/totjug
'<span id="spnroply">'+
  nroplyf+
  '</span>'+
 '</div>';

dvcongme.appendChild(nudiv);

dvcongme.removeChild(dvcrtgme);  

  
}//ready game options


function jnspC(rmj,nmejuef,lisjuef,nroplyf){
  crtgaM(rmj,nmejuef,lisjuef,nroplyf);
}//juntarse o spectate


function crtgaM(rmj,nmejuef,lisjuef,nroplyf){
  
  var rmj=roomj;
  var nmejue=nmejuef;
  var lisjue=lisjuef;
  var nroply=nroplyf;
  
  if(typeof(sltypgme)!="undefined"){
   nmejue= sltypgme.options[sltypgme.selectedIndex].value;
   lisjue= sllst.options[sllst.selectedIndex].value;
   nroply= slnroply.options[slnroply.selectedIndex].value;
  
  
  rdygmE(rmj,nmejue,lisjue,nroply);
  }//if crea barra
  
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
'<div id="dvjuse">'+
  '<div id="dvjue_u_nm_'+"juex"+'" class="dvjue_u_nm"></div>'+
    '<div id="dvjue_u_bts_'+"juex"+'" class="dvjue_u_bts">'+          
    '<input type="button" value="dict"'+
   ' onclick="mstdcT(\''+"juex"+'\')" id="btdct_'+"juex"+'"></div>'+
  '</div>'+
'</div>'+
  
  
  '<div id="dvjmsg">'+
  
'<form id="fmjmsg" class="fmchtmsg" onsubmit="envmsgJ(event)">'+
'<input type="text" id="injmsg" class="inchtmsg" placeholder="write your text...">'+
'<button id="btnjsndm" class="btnchtmsg" type="submit" >'+
  '<i class="fa fa-paper-plane" aria-hidden="true"></i>'+
  '</button>'+  
'<button'+
  ' class="btnchtemj"  onclick="selemJ()">'+
  '<i class="fa fa-smile-o" aria-hidden="true"></i>'+
    '</button>'+  
'</form></div>'+
  
  '<div id="dvdct_'+"juex"+'" class="dvdct">'+
  
  '<form onsubmit="event.preventDefault()">'+
'      <input type="text" id="inwrd_'+"juex"+'"'+
'   placeholder="word..." class=inwrd>'+
'      <input type="submit"'+
'    value="dictENG"'+
'    onclick="defwrdniK(inwrd_'+"juex"+'.value,\''+"juex"+'\')">'+
'      <input type="button" value="X"'+
'             onclick="inwrd_'+"juex"+'.value=\'\'">  '+
'        </form>'+
'      '+
'      '+
'      <input type="button"'+
'   value="Translate"'+
'   onclick="trdphR(inwrd_'+"juex"+'.value,\''+"juex"+'\')">'+
'   '+
'   <input list="dtlstlng" id="inlstlngfrm"'+
'    placeholder="from...">'+
'  <input list="dtlstlng" id="inlstlngto"'+
'    placeholder="to...">'+
''+
'<datalist id="dtlstlng">'+
'<option value="en">English</option>'+
'<option value="es">Spanish</option>'+
'<option value="fr">French</option>'+
'<option value="ru">Russian</option>'+
'<option value="pt">Portuguese</option>'+
''+
'<option value="it">Italian</option>'+
'<option value="de">German</option>'+
'<option value="ar">Arabic</option>'+
'<option value="zh">Chinese</option>'+
'<option value="ko">Korean</option>'+
''+
'<option value="id">Indonesian</option>'+
'<option value="ja">Japanese</option>'+
'<option value="hi">Hindi</option>'+
'<option value="sv">Swedish</option>'+
'<option value="tr">Turkish</option>'+
'</datalist>'+
'      '+
'      <input type="button" value="dictYandex"'+
' onclick="defyaN(inwrd_'+"juex"+'.value,\''+"juex"+'\')">'+
'      '+
'      <div id="dvrsldct_'+"juex"+'"'+
'           class="dvrsldct"></div>'+
     
     '</div>';;

  dvcongme.appendChild(nudivj);
    
  sktclt.emit("entroomj",
              {idjue:rmj,
               nroply:nroply,
               nmejue:nmejue,
               lisjue:lisjue});
 
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


sktclt.on("juego creado",function(dt){
  //dt{room,nroply,nmejue,lisjue}
  console.log("barra de juego");
  rdygmE(dt.room,dt.nmejue,dt.lisjue,dt.nroply);
});


sktclt.on("mndusrjue",function(dt){
  //dt{usrjue{usrid(firstnm)},room,nroply,nmejue,lisjue}
  console.log("recibe user pal juego");
  console.log(dt);
 var usrj="";

for(var nom in dt.usrjue){
 usrj+=dt.usrjue[nom]+"<br>";
}//for
dvjue_u_nm_juex.innerHTML="";
dvjue_u_nm_juex.innerHTML=usrj;
  
    
  if(Object.keys(dt.usrjue).length==dt.nroply){
    alert("start game!");
    sktclt.emit("start game","vamos");
  }//if, enviar emit socket start game
  
});//se juntaron al juego


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
  //data{msg,nick,guess}
  
   if(data.guess){
     
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



