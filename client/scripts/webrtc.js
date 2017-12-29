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
 GUM();
 doJoin(room);
 
}//clL


function hangUp() {
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();
}//colgar


function GUM(){
  
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
 var btnmute = document.querySelector("#btnmute");
 btnmute.onclick= function(){
  track.enabled= !track.enabled;
  btnmute.style.backgroundColor= btnmute.style.backgroundColor=="green"? "grey":"green";
};//btnmute onclick

});//local stream


webrtc.on("readyToCall",function(){
  if (room) {
  webrtc.joinRoom(room, function(err,res){
    console.log("se junta al room "+room);
if(err) return;
setTimeout(function(){
 webrtc.sendToAll("juntado rtc",
               {msgrtc:"juntadoenrtc"});
},1000);//settimeout
});//joinroom
}//if room
});//webrtc ready to call



// called when a peer is created
webrtc.on('createdPeer', function (peer) {
 console.log("creado peer");
 console.log(peer);

});//created peer


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