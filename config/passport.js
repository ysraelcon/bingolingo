var lclstrtg=require('passport-local').Strategy;
var User=require('../app/models/user');


module.exports=function(pssp){
  
 pssp.serializeUser(function(user,done){
  done(null,user.id);
});//serialize

pssp.deserializeUser(function(id,done){
 User.findById(id,function(err,user){
  done(err,user);
});//find
});//deserialize



pssp.use('register',new lclstrtg({
 usernameField:'email',
 passwordField:'password',
 passReqToCallback:true},

 function(req,email,password,done){
  
  User.findOne({email:email},
              function(err,user){
    
  if(err){return done(err);}
  if(user){
   return done(null,false,req.flash('registerMessage',"email is already taken"));
}else{
  
 var newUser=new User();
  
 newUser.email=email;
 newUser.firstnm=req.body.firstnm;
 newUser.lastnm=req.body.lastnm;
  console.log(req.body.firstnm);
 newUser.password=newUser.generateHash(password);
  
 newUser.save(function(err){
  if(err){throw err};
  return done(null,newUser);
  });//save
}//else 
});//findone
}));//lclstrtg use register


pssp.use('login',new lclstrtg({
 usernameField:'email',
 passwordField:'password',
 passReqToCallback:true},

 function(req,email,password,done){
  
  User.findOne({email:email},
    function(err,user){
    
  if(err){return done(err);}
  if(!user){
   return done(null,false,req.flash('loginMsg',"Incorrect username"));
}//if
  if(!user.validPassword(password)){
 return done(null,false,req.flash('loginMsg',"Incorrect password"));
}//if

return done(null,user);
});//findone
  
}));//lclstrtg use

};//exports

