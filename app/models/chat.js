//fecha: 16-09-18, 17-09

var mongoose=require('mongoose');

var chatsch= mongoose.Schema({
  reportes: [],
  chats: mongoose.Schema.Types.Mixed,
  chtsprv: mongoose.Schema.Types.Mixed
});


module.exports= mongoose.model("Chat", chatsch);

//http://mongoosejs.com/docs/schematypes.html