//fecha: 16-09-18, 17-09

var mongoose= require('mongoose');
var bcrypt= require('bcrypt-nodejs');

var usersch= mongoose.Schema({
  avatar: String,
  firstnm: String,
  lastnm: String,
  country: String,
  age: Number,
  gender: String,
  learning: String,
  speaks: String,
  aboutme: String,
  email: {type: String, unique:true},
  password: {type: String},
  notes: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  chats: mongoose.Schema.Types.Mixed
});//user datos
//city,in,description,yearborn,monthborn,

usersch.methods.generateHash= function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(6), null);
};//hash password

usersch.methods.validPassword= function(password){
 return bcrypt.compareSync(password, this.password);
};//validar password

module.exports= mongoose.model('User', usersch);



