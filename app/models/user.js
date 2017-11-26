var Mng=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var usrsch=Mng.Schema({
  firstnm:String,
  lastnm:String,
  country:String,
  age:Number,
  gender:String,
  learning:String,
  speaks:String,
email:{type:String,unique:true},
password:{type:String},
  chats:Mng.Schema.Types.Mixed
});

usrsch.methods.generateHash= function(password){
 return bcrypt.hashSync(password,
                bcrypt.genSaltSync(6),null);
};

usrsch.methods.validPassword=function(password){
 return bcrypt.compareSync(password,
                           this.password);
};

module.exports=Mng.model('User',usrsch);



