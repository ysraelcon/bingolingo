
var lclstrtg=require('passport-local').Strategy;
var User=require('../app/models/user');


module.exports= function(passportf){
  
 passportf.serializeUser(function(user,done){
  done(null,user.id);
});//serialize

passportf.deserializeUser(function(id,done){
 User.findById(id,function(err,user){
  done(err,user);
});//find
});//deserialize



passportf.use('register',new lclstrtg({
 usernameField:'email',
 passwordField:'password',
 passReqToCallback:true},
 function(req,email,password,done){
  
  User.findOne({email:email}, function(err,user){
    
  if(err){return done(err);}
  if(user){
    console.log("email taken");
   return done(null,false, req.flash('registerMessage', "email is already taken"));
}else{
  
 var new_User=new User();
  
 new_User.email=email;
 new_User.firstname= req.body.firstname;
 new_User.lastname= req.body.lastname;
  //console.log(req.body.firstname);
 new_User.password= new_User.generateHash(password);
  
 new_User.save(function(err){
  if(err){throw err};
  return done(null,new_User);
  });//save
}//else 
});//findone
}));//lclstrtg use register


passportf.use('login',new lclstrtg({
 usernameField:'email',
 passwordField:'password',
 passReqToCallback:true},
 function(req,email,password,done){
  
  User.findOne({email:email}, function(err,user){
    
  if(err){return done(err);}
  if(!user){
    console.log("no username");
   return done(null,false, req.flash('loginMsg',"Incorrect username"));
}//if
  if(!user.validPassword(password)){
    console.log("wrong password");
 return done(null,false, req.flash('loginMsg',"Incorrect password"));
}//if

return done(null,user);
});//findone
  
}));//lclstrtg use

};//exports

