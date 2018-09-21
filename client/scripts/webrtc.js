//fecha: 16-09-18, 19-09, 20-09

function solicitar_llamada(btf,roombthx){
  if(btf.style.backgroundColor=="green"){
    btf.removeAttribute("style");
    socketclient.emit("colgar llamada",
                {roomrtc:roombthx});
  }//if
  else{
    btf.style.backgroundColor= "green";

    socketclient.emit("solicitar llamada",
               {roomrtc:roombthx});
  }//else
}//solicitar llamada



socketclient.on("solicitud de aceptacion de la llamada",function(dt){
 //dt{roomrtc,sktidmnd,nmemnd}

  if(dt.sktidmnd!=socketclient.id){
 
    var nudiv= document.createElement("div");
    nudiv.id= "dvrecibecall_"+dt.roomrtc;
    nudiv.setAttribute("class","dvrecibecall");

    nudiv.innerHTML= '<div class="dvrecibecallnm"><b>'+dt.nmemnd+
      '</b> is '+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
      '... </div>'+
    '<div class="dvrecibecallmas" onclick="aceptar_llamada(\''+dt.roomrtc+'\')">+</div>'+
    '<div class="dvrecibecallcerrar" onclick="cancelar_llamada(\''+dt.roomrtc+'\')">x</div>';

    var dvchatroom_con_= document.getElementById("dvchatroom_con_"+dt.roomrtc);

    dvchatroom_con_.appendChild(nudiv);

  }//if el que rcb llamada
  else{

  
    var nudiv= document.createElement("div");
    nudiv.id= "dvespcall_"+dt.roomrtc;
    nudiv.setAttribute("class","dvespcall");

    nudiv.innerHTML= '<div class="dvespcallnm">waiting for '+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>... </div>'+
    '<div class="dvespcallcerrar" onclick="cerrar_llamada(\''+dt.roomrtc+'\')">x</div>';

    var dvchatroom_con_= document.getElementById("dvchatroom_con_"+dt.roomrtc);

    dvchatroom_con_.appendChild(nudiv);
  
  }//else wait for the acept call

});//skcl solicitud de acepation de llamada



//cancelar llamada enviada
function cerrar_llamada(roomf){
 
  var dvchatroom_con_= document.getElementById("dvchatroom_con_"+roomf);
  var dvespcall= document.getElementById("dvespcall_"+roomf);

  if(dvespcall){
    socketclient.emit("cancelar llamada entrante",
              {roomrtc:roomf});
    dvchatroom_con_.removeChild(dvespcall);
  }//if esta

}//cerrar_llamada



//cancelar llamada recibida
function cancelar_llamada(roomf){
 
  var dvchatroom_con_= document.getElementById("dvchatroom_con_"+roomf);
  var dvrecibecall= document.getElementById("dvrecibecall_"+roomf);

  if(dvrecibecall){
    socketclient.emit("cancelar llamada entrante",
              {roomrtc:roomf}); 
    dvchatroom_con_.removeChild(dvrecibecall);
  }//if esta

}//cancelar_llamada



socketclient.on("se cancelo llamada",function(dt){
  //dt{roomrtc}

  cerrar_llamada(dt.roomrtc);
  cancelar_llamada(dt.roomrtc);
});//skcl se cancelo llamada



//se acepta la llamada y empieza a correr
function aceptar_llamada(roomf){
  cancelar_llamada(roomf);
  
  var btcall= document.getElementById("btcall_"+roomf);

  btcall.style.backgroundColor= "green";
  socketclient.emit("correr llamada",
              {roomrtc:roomf});
}//aceptar_llamada



socketclient.on("correr webrtc",function(dt){
  //dt{roomrtc}

  iniciar_llamada(dt.roomrtc);
});//skcl correr webrtc



socketclient.on("se cuelga llamada",function(dt){
  //dt{roomrtc}
  hangUp();
  
  var btcall= document.getElementById("btcall_"+dt.roomrtc);

  if(btcall.style.backgroundColor=="green"){
    btcall.removeAttribute("style");
  }//if verde
});//skcl se cuelga llamada


//join group voice chat
function juntarse_llamadasecret(btf,roomf){

  if(btf.style.backgroundColor=="green"){
    btf.removeAttribute("style");
    hangUp();
  }else{
    btf.style.backgroundColor= "green";
    iniciar_llamada(roomf);
  }//else llama
}//juntarse_llamadasecret


//=====webrtc

var room;
var webrtc;

// for simplistic metrics gathering
function track(name, info) {
    if (webrtc && webrtc.connection) {
        webrtc.connection.emit('metrics', name, info || {});
    }
}//track



function doJoin(room) {
    webrtc.startLocalVideo();
    webrtc.createRoom(room, function (err, name) {
        if(!err){ console.log("creado bien");}
        else{
         console.log("error",err,room);}
    });//create room
}//doJoin

function iniciar_llamada(roomf){
  room=roomf;
  //GUM(); 
  doJoin(room);
 
}//iniciar_llamada


function hangUp() {
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();
}//colgar


function GUM(){
  console.log("se ejecuta gum");
  webrtc = new SimpleWebRTC({
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
    

  webrtc.on("localStream", function(stream){
    console.log("local streammm");
    lclaud.disabled= false;//elemento audio id lclaud
    lclaud.volume= 0;
    var track= stream.getAudioTracks()[0];

    var btnmute = document.querySelector(".btmtecall");
    btnmute.onclick= function(){
      track.enabled= !track.enabled;
      btnmute.style.backgroundColor= btnmute.style.backgroundColor=="green"? "grey":"green";
    };//btnmute onclick

  });//local stream


  // called when a peer is created
  webrtc.on('createdPeer', function (peer) {
    console.log("creado peer");
    console.log(peer);
  });//created peer  
  
  
  webrtc.on("readyToCall",function(){
    if (room) {
      webrtc.joinRoom(room, function(err,res){
        console.log("se junta al room "+room);
        if(err) return;
        setTimeout(function(){
          console.log("juntadoo rtc");
          webrtc.sendToAll("juntado rtc",
                       {msgrtc:"juntadoenrtc"});
        },1000);//settimeout
      });//joinroom
    }//if room
  });//webrtc ready to call



// local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        console.log('local fail', peer.sid);
        track('iceFailed', {
            source: 'local',
            session: peer.sid,
            peerprefix: peer.browserPrefix,
            prefix: webrtc.capabilities.prefix,
            version: webrtc.capabilities.browserVersion
        });
    });

    // remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
        console.log('remote fail', peer.sid);
        track('iceFailed', {
            source: 'remote',
            session: peer.sid,
            peerprefix: peer.browserPrefix,
            prefix: webrtc.capabilities.prefix,
            version: webrtc.capabilities.browserVersion
        });
    });

}//GUM

//ejecutarse despues de cargarse
setTimeout(function(){
  console.log("se va a ejecutar GUM");
  GUM();
},3000);
