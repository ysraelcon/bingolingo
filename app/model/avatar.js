
var mongoose= require('mongoose');

var avatar_sch= mongoose.Schema({
  avatars: mongoose.Schema.Types.Mixed
});


module.exports= mongoose.model("Chat", avatar_sch);
