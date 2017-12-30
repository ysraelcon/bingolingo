function slcllM(btf,roombthx){
 if(btf.style.backgroundColor=="green"){
  btf.removeAttribute("style");
  sktclt.emit("colgar llamada",
              {rmrtc:roombthx});
}//if
else{
 btf.style.backgroundColor= "green";
 
 sktclt.emit("solicitar llamada",
             {rmrtc:roombthx});
}//else
}//solicitar llamada


sktclt.on("solicitud de aceptacion de la llamada",function(dt){
 //dt{rmrtc,sktidmnd,nmemnd}

  if(dt.sktidmnd!=sktclt.id){
 
    var nudiv= document.createElement("div");
nudiv.id= "dvrcbcll_"+dt.rmrtc;
nudiv.setAttribute("class","dvrcbcll");

nudiv.innerHTML= '<div class="dvrcbcllnm"><b>'+dt.nmemnd+
  '</b> is '+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
  '... </div>'+
'<div class="dvrcbcllmas" onclick="acpclL(\''+dt.rmrtc+'\')">+</div>'+
'<div class="dvrcbcllcrr" onclick="cncclL(\''+dt.rmrtc+'\')">x</div>';

var dvcht_c= document.getElementById("dvcht_c_"+dt.rmrtc);

dvcht_c.appendChild(nudiv);
    
}//if el que rcb llmd
else{

  
  var nudiv= document.createElement("div");
nudiv.id= "dvespcll_"+dt.rmrtc;
nudiv.setAttribute("class","dvespcll");

nudiv.innerHTML= '<div class="dvespcllnm">waiting for '+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>... </div>'+
'<div class="dvespcllcrr" onclick="crrclL(\''+dt.rmrtc+'\')">x</div>';

var dvcht_c= document.getElementById("dvcht_c_"+dt.rmrtc);

dvcht_c.appendChild(nudiv);
  
}//else wait for the acept call

});//skcl solicitud de acepation de llmd


//cancelar llamada enviada
function crrclL(rmf){
 
var dvcht_c= document.getElementById("dvcht_c_"+rmf);
var dvespcll= document.getElementById("dvespcll_"+rmf);

if(dvespcll){
  sktclt.emit("cancelar llamada entrante",
            {rmrtc:rmf});
 dvcht_c.removeChild(dvespcll);
}//if esta

}//crrclL

//cancelar llamada recibida
function cncclL(rmf){
 
var dvcht_c= document.getElementById("dvcht_c_"+rmf);
var dvrcbcll= document.getElementById("dvrcbcll_"+rmf);

if(dvrcbcll){
 sktclt.emit("cancelar llamada entrante",
            {rmrtc:rmf}); 
 dvcht_c.removeChild(dvrcbcll);
}//if esta

}//cncclL


sktclt.on("se cancelo llmd",function(dt){
 //dt{rmrtc}

crrclL(dt.rmrtc);
cncclL(dt.rmrtc);
});//skcl se cancelo llmd


//se acepta la llamada y empieza a correr
function acpclL(rmf){
 cncclL(rmf);
  
 var btcll= document.getElementById("btcll_"+rmf);

btcll.style.backgroundColor= "green";
 sktclt.emit("correr llmd",
              {rmrtc:rmf});
}//acpclL


sktclt.on("correr webrtc",function(dt){
 //dt{rmrtc}

clL(dt.rmrtc);
});//skcl correr webrtc


sktclt.on("se cuelga llmd",function(dt){
 //dt{rmrtc}
hangUp();
  
var btcll= document.getElementById("btcll_"+dt.rmrtc);

if(btcll.style.backgroundColor=="green"){
 btcll.removeAttribute("style");
}//if verde
});//skcl se cuelga llmd



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

function clL(rmf){
 room=rmf;
//GUM(); 
 doJoin(room);
 
}//clL


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
        receiveMedia: { // FIXME: remove old chrome <= 37 constraints format
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 0
        },
    });//webrtc
    

webrtc.on("localStream", function(stream){
  console.log("local streammm");
 lclaud.disabled= false;//elemento audio id lclaud
 lclaud.volume= 0;
 var track= stream.getAudioTracks()[0];
 
 var btnmute = document.querySelector(".btmtecll");
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
},1000);
