var User=require('../app/models/user');
var Chat=require('../app/models/chat');

module.exports=function(Ap,pssp){

Ap.get("/",function(req,res){
 //res.render("login.ejs",{msg:""});
});

  /*
Ap.get("/home",function(req,res){
 
  res.render("signup.ejs");
  
  var newChat= new Chat();
  
  newChat.save();//save
             
});*/

  /*
Ap.get("/signup",function(req,res){
 res.render("signup.ejs");
});*/

Ap.get("/login",function(req,res){
 //res.render("login.ejs",{msg:req.flash('loginMsg')});
});
  
Ap.post("/login",pssp.authenticate('login',
  {successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true}
));//post login
/*
Ap.get("/tabs",function(req,res){
 res.render("tabs.ejs");
});*/


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
 res.json(req.user);
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
 User.findOne({firstnm:req.user.firstnm},
              (err, user) => {
 // updating that event
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
  
};//exports

function isLoggedIn(req,res,next){
 if(req.isAuthenticated())
  return next();
 res.redirect('/');
}
