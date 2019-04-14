
var mongoose= require('mongoose');
var bcrypt= require('bcrypt-nodejs');

var user_sch= mongoose.Schema(
{
avatar: String,
firstname: String,
lastname: String,
country: String,
age: Number,
gender: String,
learning: String,
speaks: String,
about_me: String,
email: {type: String, unique:true},
password: {type: String},
fecha_de_registro: {type: Date, 'default': Date.now, index: true},
fecha_de_login: {type: Date, 'default': Date.now, index: true},
notes: String,
resetPasswordToken: String,
resetPasswordExpires: Date,
chats: mongoose.Schema.Types.Mixed,
online: { type: Boolean, default: false }
});//user datos
//city,in,description,yearborn,monthborn,

user_sch.methods.generateHash= function(password)
{
console.log("genera hash del: password")
return bcrypt.hashSync(password, bcrypt.genSaltSync(6), null);
};//hash password

user_sch.methods.validPassword= function(password)
{
console.log("valida password: password")
return bcrypt.compareSync(password, this.password);
};//validar password

module.exports= mongoose.model('User', user_sch);



