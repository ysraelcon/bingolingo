var Mng=require('mongoose');

var chtsch=Mng.Schema({
  
  chats:{general:[]}
});


module.exports=Mng.model("Chat",chtsch);