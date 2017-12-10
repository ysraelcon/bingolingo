var Mng=require('mongoose');

var chtsch=Mng.Schema({
  reportes:[],
  chats:Mng.Schema.Types.Mixed
});


module.exports=Mng.model("Chat",chtsch);

//http://mongoosejs.com/docs/schematypes.html