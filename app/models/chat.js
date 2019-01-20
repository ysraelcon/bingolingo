
var mongoose=require('mongoose');

var chat_sch= mongoose.Schema({
  reportes: [],
  chats: mongoose.Schema.Types.Mixed,
  chats_prv: mongoose.Schema.Types.Mixed
});


module.exports= mongoose.model("Chat", chat_sch);

//http://mongoosejs.com/docs/schematypes.html