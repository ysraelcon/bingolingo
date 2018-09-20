//fecha: 16-09-18, 17-09

var mongoose= require('mongoose');

var avatarsch= mongoose.Schema({
  avatars: mongoose.Schema.Types.Mixed
});


module.exports= mongoose.model("Chat", avatarsch);
