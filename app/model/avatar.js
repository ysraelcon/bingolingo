//fecha: 16-09-18

var Mng=require('mongoose');

var avtrsch=Mng.Schema({
  avatars:Mng.Schema.Types.Mixed
});


module.exports=Mng.model("Chat",avtrsch);
