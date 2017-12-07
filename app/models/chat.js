var Mng=require('mongoose');

var chtsch=Mng.Schema({
  
  chats:Mng.Schema.Types.Mixed
});


module.exports=Mng.model("Chat",chtsch);