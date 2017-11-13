//despues de socket.io/socket.io.js

var sktclt=io.connect();



function entrchT(){
 sktclt.emit("userva","hola");
}//click tab chat

sktclt.on("usernames",function(dat){
 var conusr="";

for(var usrnme in dat){
 conusr+="<tr id=\'"+dat[usrnme]._id+
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








function entrgnrL(){
 var nudiv=document.createElement("DIV");
nudiv.id="dvicht";


nudiv.innerHTML='<div id="dvichtt">'+
    '<div id="dvichttn">General</div>'+
  '<div id="dvichttm" onclick="mindvichT()">-</div>'+
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

}//entrar al general room


sktclt.on("mndusrgnrl",function(dt,arrcht){
  var usrsg=""
  
  for(var nombr in dt){
    usrsg+=nombr+"<br>";
  }
 dvichtu.innerHTML="";
 dvichtu.innerHTML=usrsg;
  
  var licht=dvichtc.innerHTML;

  for(var msgcht in arrcht){
    licht+=arrcht[msgcht]+"<br>";
  }
 dvichtc.innerHTML=licht;
  
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

//hacer el de restaura tamaño !!!

function crrdvichT(){
 dvchtc.removeChild(dvicht);
 sktclt.emit("cerrgnrl");
 /* //se puede hacer esto
  jQuery(function($){
    $("#dvchtrnm").draggable();
  });*/
  
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

 //dvichtc.scrollTo(0,dvichtc.scrollHeight);
jQuery(function($){
  $("#dvichtc").append('<b>'+data.nick+":</b> "+data.msg+"<br/>");
  $("#dvichtc").stop().animate({ scrollTop: $("#dvichtc")[0].scrollHeight}, 300);
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
 alert("chat request, coming soon");
  console.log(ele.id);
}//chat request

function crrinfusR(){
  dvchtc.removeChild(dvinfusr);
  
}//cerrar inf prf y cht rqst


//=====juego

var roomj="roomjue";


sktclt.on("mndusrjue",function(dt){
 var usrj="";

for(var nom in dt){
 usrj+=dt[nom]+"<br>";
}//for
dvjuse.innerHTML="";
dvjuse.innerHTML=usrj;
});//se juntaron al juego


function crtgaM(){
   
var nudivj=document.createElement("DIV");
nudivj.id="dvjue";

nudivj.innerHTML='<div id="dvjtit" draggable="true">'+
'<div id="dvjnm">'+
  '<div id="dvjnmtit">Explain The Word</div>'+
  '<div id="dvjnmmin">-</div>'+
  '<div id="dvjnmmit">L</div>'+
  '<div id="dvjnmcrr" onclick="crrjuE()">X</div>'+
  '</div>'+
'<div id="dvjexp">Explains: <span>wordX</span'+
'><span id="sptmr">00</span></div></div>'+
'<div id="dvjcu">'+
'<div id="dvjcon"></div>'+
'<div id="dvjuse">Users</div>'+
'</div><div id="dvjmsg">'+
'<form id="fmjmsg" onsubmit="return false">'+
'<input type="text" id="injmsg" placeholder="write your text..."'+
'><input type="submit" value="Send" id="btnjsndm" >'+
'</form></div></div>';

  dvgmc.appendChild(nudivj);
    
  sktclt.emit("entroomj",roomj);
  
};//crear juego

function crrjuE(){
  dvgmc.removeChild(dvjue);
  sktclt.emit("slrjue");
}//cerrar juego


jQuery(function($) {
  var Sk=io.connect();
  
    
  

 Sk.on('new messagejue', function(data) {
  
   if(/bingo/i.test(data.msg)){
     $("#dvjcon").append('<b>'+data.nick+":</b> "+data.msg+"<br/>"+
                        "BINGO, you guessed the word!<br>");
   }else{
     $("#dvjcon").append('<b>'+data.nick+":</b> "+data.msg+"<br/>");
   }
  $("#dvjcon").stop().animate({ scrollTop: $("#dvjcon")[0].scrollHeight}, 100);
});//on receive msg
  
 
  
  $("#dvgmc").on("click","#fmjmsg",function(){

$(this).submit(function(e) {
   e.preventDefault();
   if($("#injmsg").val()!='')
     Sk.emit('send messagejue', $("#injmsg").val());
  
  $("#injmsg").val('');
 
});//on send msg
});//send msg juego
  
  
})//jquery



