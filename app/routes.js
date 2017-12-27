
var User=require('../app/models/user');
var Chat=require('../app/models/chat');
var ndmlr= require('nodemailer');


module.exports=function(Ap,pssp){

Ap.get("/",function(req,res){
 //res.render("login.ejs",{msg:""});
 
});

  
Ap.get("/home",function(req,res){
 
  res.json({message:req.flash("registerMessage")});
               
});

  /*
Ap.get("/signup",function(req,res){
 res.render("signup.ejs");
});*/

Ap.get("/reset/:token",function(req,res){
  
 res.render("reset.ejs",{token:req.params.token});
});//get reset
  
  
Ap.post("/reset/:token",function(req,res){
  console.log(req.body.password);
  User.findOne({ resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } },
               function(err, user) {
        if (!user) {
          
          return res.send('Password reset token is invalid or has expired. <a href="https://bestalk-test.glitch.me">home</a>');
        }//if
//console.log(user);
        user.password = user.generateHash(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
    
    user.save((err) => {
  if (err) throw err;
      });//save
    
    res.send("Password reseted succesfully! <a href='https://bestalk-test.glitch.me'>Login</a>");
    
  });//findone
  
  
});//post reset


Ap.get("/login",function(req,res){
 //res.render("login.ejs",{msg:req.flash('loginMsg')});
  res.json({message:req.flash("loginMsg")});
});
  
Ap.post("/login",pssp.authenticate('login',
  {successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true}
));//post login



Ap.post('/signup',pssp.authenticate('register',{
 successRedirect:'/profile',
 failureRedirect:'/home',
 failureFlash:true
}));//post

Ap.get('/profile',isLoggedIn,function(req,res){
 res.json(req.user);
  //res.render('/profile/profile.html',{user:req.user});
  //res.render('profile.ejs',{user:req.user});
});//get f
  
Ap.get('/edit',isLoggedIn,function(req,res){
 res.json({message:req.flash("errors")});
  //res.render('edit.ejs',{user:req.user});
});//get 
  
Ap.post('/edit',isLoggedIn,function(req,res){
  
// validate information
 req.checkBody('firstnm',
          'First Name is required.').notEmpty();
 req.checkBody('age',
          'Age is required.').notEmpty();

// if there are errors, redirect and save errors to flash
const errors = req.validationErrors();
  if (errors) {
  console.log(errors);
   req.flash('errors',
             errors.map(err => err.msg));
   return res.redirect("/edit");
  }//if

// finding a current event
 User.findOne({_id:req.user._id},
              (err, user) => {
 // updating that event
   
   //console.log(req.body);
 user.avatar= req.body.avatar;  
 user.firstnm = req.body.firstnm;
 user.lastnm = req.body.lastnm;
 user.gender= req.body.gender;
   user.age= req.body.age;
   user.country= req.body.country;
   user.learning= req.body.learning;
   user.speaks= req.body.speaks;

 user.save((err) => {
  if (err) throw err;

// success flash message
// redirect back to the /events
 req.flash('success',
           'Successfully updated event.');
 res.redirect('/profile');
});//ev.save
});//ev.findone
  
});//post edit

Ap.get('/logout',function(req,res){
 req.logout();
res.redirect('/');
});//get
  
  
Ap.post('/mail',function(req,res){
    
  var token=Math.random().toString(36)
        .replace(/[^a-z]+/g, '').substr(0, 5);
  console.log(token);
  
  User.findOne({ email: req.body.email },
                function(err, user){
    
    if(!user){
          
          //return res.redirect('/mail');
      res.json({message:"No email address exists."});
        }//if
    else{
      
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      user.save((err) => {
  if (err) throw err;
      });//save
      
      var transporter= ndmlr.createTransport({
    service:'gmail',
    auth:{user: process.env.MAILSENDER,
          pass: process.env.MAILSENDERPWD}
  });//transporter
  
  var mailopts={
 from: process.env.MAILSENDER,
 to: req.body.email,//or list
 subject: 'Password Reset',
 html: '<p>Visit the link for set your new password:</p>'+
    '<a href="https://bestalk-test.glitch.me/reset/'+
    token+
    '">Reset Password</a>'+
    '<h2>Continue enjoying of BesTalk!</h2>'
};//mailopts
  
  
 transporter.sendMail(mailopts, function(err, info){
   if(err)
     console.log(err)
   else
     console.log(info);
});//sendmail 
  
  res.json({message:"Check your mail for get your password"});
      
    }//else
    console.log(user);
  });//findone
  
  
  
  
});//post enviar mail 
  
   
};//exports





function isLoggedIn(req,res,next){
 if(req.isAuthenticated())
  return next();
 res.redirect('/');
}
