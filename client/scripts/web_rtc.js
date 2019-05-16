
function solicitar_llamada(btf,room_bthx)
{
console.log("solicita llamada: "+room_bthx)
if(btf.style.backgroundColor == "green")
{
btf.removeAttribute("style");
socket_client.emit("colgar llamada", {room_rtc: room_bthx});
}//if
else{
btf.style.backgroundColor= "green";
socket_client.emit("solicitar llamada", {room_rtc: room_bthx});
}//else
}//solicitar llamada



socket_client.on("solicitud de aceptacion de la llamada", function(dt)
{
//dt{room_rtc,skt_id_mnd,nme_mnd}
console.log("solicitud de aceptacion de la llamada")
if(dt.sktid_mnd != socket_client.id)
{
var nudiv= document.createElement("div");
nudiv.id= "dv_recibe_call_"+dt.room_rtc;
nudiv.setAttribute("class", "flex_row pos_a top_10 w bac_whi gre");
nudiv.innerHTML= '<div class="w_"><b class="bla">'+dt.nmemnd
+'</b> is '
+'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'//phone
+'... </div>'
+'<div class="ali_cen w10 bor_r bac_285 whi" onclick="aceptar_llamada(\''+dt.room_rtc+'\')">+</div>'
+'<div class="ali_cen w10 bor_r bac_800 whi" onclick="cancelar_llamada(\''+dt.room_rtc+'\')">x</div>';
var dv_chat_room_con_= document.getElementById("dv_chat_room_con_"+dt.room_rtc);
dv_chat_room_con_.appendChild(nudiv);
}//if el que rcb llamada
else
{
var nudiv= document.createElement("div");
nudiv.id= "dv_esp_call_"+dt.room_rtc;
nudiv.setAttribute("class","flex_row pos_a top_10 w bac_whi gre");
nudiv.innerHTML= '<div class="w_">waiting for '
+'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>... </div>'
+'<div class="ali_cen w10 bor_r bac_800 whi" onclick="cerrar_llamada(\''+dt.room_rtc+'\')">x</div>';
var dv_chat_room_con_= document.getElementById("dv_chat_room_con_"+dt.room_rtc);
dv_chat_room_con_.appendChild(nudiv);
}//else wait for the acept call
});//skcl solicitud de acepation de llamada



//cancelar llamada enviada
function cerrar_llamada(roomf)
{
console.log("cierra llamada:"+roomf)
var dv_chat_room_con_= document.getElementById("dv_chat_room_con_"+roomf);
var dv_esp_call= document.getElementById("dv_esp_call_"+roomf);
if(dv_esp_call)
{
socket_client.emit("cancelar llamada entrante", {room_rtc: roomf});
dv_chat_room_con_.removeChild(dv_esp_call);
}//if esta
}//cerrar_llamada



//cancelar llamada recibida
function cancelar_llamada(roomf)
{
console.log("cancela llamada: "+roomf)
var dv_chat_room_con_= document.getElementById("dv_chat_room_con_"+roomf);
var dv_recibe_call= document.getElementById("dv_recibe_call_"+roomf);
if(dv_recibe_call)
{
socket_client.emit("cancelar llamada entrante", {roo_mrtc: roomf}); 
dv_chat_room_con_.removeChild(dv_recibe_call);
}//if esta
}//cancelar_llamada



socket_client.on("se cancelo llamada", function(dt)
{
//dt{room_rtc}
console.log("se cancela llamada")
cerrar_llamada(dt.room_rtc);
cancelar_llamada(dt.room_rtc);
});//skcl se cancelo llamada



//se acepta la llamada y empieza a correr
function aceptar_llamada(roomf)
{
console.log("acepta llamada")
cancelar_llamada(roomf);
var bt_call= document.getElementById("bt_call_"+roomf);
bt_call.style.backgroundColor= "green";
socket_client.emit("correr llamada", {roomrtc: roomf});
}//aceptar_llamada



socket_client.on("correr web rtc", function(dt)
{
//dt{roomrtc}
console.log("corre web rtc")
iniciar_llamada(dt.room_rtc);
});//skcl correr webrtc



socket_client.on("se cuelga llamada", function(dt)
{
//dt{roomrtc}
console.log("se cuelga llamada")
hangUp();
var bt_call= document.getElementById("bt_call_"+dt.room_rtc);
if(bt_call.style.backgroundColor == "green")
{
bt_call.removeAttribute("style");
}//if verde
});//skcl se cuelga llamada


//join group voice chat
function juntarse_llamada_secret(btf,roomf)
{
console.log("juntarse llamada secret: "+roomf)
if(btf.style.backgroundColor == "green")
{
btf.removeAttribute("style");
hangUp();
}else
{
btf.style.backgroundColor= "green";
iniciar_llamada(roomf);
}//else llama
}//juntarse_llamada_secret


//=====webrtc

var room;
var web_rtc;

// for simplistic metrics gathering
function track(name, info)
{
console.log("track")
if (web_rtc && web_rtc.connection)
{
web_rtc.connection.emit('metrics', name, info || {});
}
}//track



function doJoin(room) 
{
console.log("do join:"+room)
web_rtc.startLocalVideo();
web_rtc.createRoom(room, function (err, name) {
if(!err){ console.log("creado bien");}
else{console.log("error", err, room);}
});//create room
}//doJoin


function iniciar_llamada(roomf)
{
console.log("inicia llamada: "+roomf)
room= roomf;
//GUM(); 
doJoin(room);
}//iniciar_llamada


function hangUp()
{
console.log("colgad")
web_rtc.stopLocalVideo();
web_rtc.leaveRoom();
}//colgar


function GUM()
{
console.log("se ejecuta gum");

web_rtc = new SimpleWebRTC({
// we don't do video
localVideoEl: '',
remoteVideosEl: '',
autoRequestMedia: false,
enableDataChannels: false,
media: {
audio: true,
video: false
},
receiveMedia: { // FIXME: remove old chrome <= 37 constraints foroomat
offerToReceiveAudio: 1,
offerToReceiveVideo: 0
},
});//webrtc
    
web_rtc.on("localStream", function(stream)
{
console.log("local streammm");
lcl_aud.disabled= false;//elemento audio id lclaud
lcl_aud.volume= 0;
var track= stream.getAudioTracks()[0];
var btn_mute = document.querySelector(".cl_bt_mte_call");
btn_mute.onclick= function(){
track.enabled= !track.enabled;
btn_mute.style.backgroundColor= btn_mute.style.backgroundColor == "green" ? "grey" : "green";
};//btnmute onclick
});//local stream


// called when a peer is created
web_rtc.on('createdPeer', function (peer) 
{
console.log("creado peer");
console.log(peer);
});//created peer  
  
  
web_rtc.on("readyToCall", function()
{
if (room) 
{
web_rtc.joinRoom(room, function(err, res){
console.log("se junta al room "+room);
if(err) return;
setTimeout(function()
{
console.log("juntadoo rtc");
web_rtc.sendToAll("juntado rtc",
{msg_rtc: "juntado en rtc"});
},1000);//settimeout
});//joinroom
}//if room
});//webrtc ready to call



// local p2p/ice failure
web_rtc.on('iceFailed', function (peer) 
{
console.log('local fail', peer.sid);
track('iceFailed', {
source: 'local',
session: peer.sid,
peerprefix: peer.browserPrefix,
prefix: web_rtc.capabilities.prefix,
version: web_rtc.capabilities.browserVersion
});
});

// remote p2p/ice failure
web_rtc.on('connectivityError', function (peer) 
{
console.log('remote fail', peer.sid);
track('iceFailed', {
source: 'remote',
session: peer.sid,
peerprefix: peer.browserPrefix,
prefix: web_rtc.capabilities.prefix,
version: web_rtc.capabilities.browserVersion
});
});

}//GUM

//ejecutarse despues de cargarse
setTimeout(function()
{
console.log("se va a ejecutar GUM");
GUM();
},3000);
