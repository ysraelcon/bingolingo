module.exports=function(Ap,pssp){

Ap.get("/",function(req,res){
 res.render("login.ejs",{msg:""});
});

Ap.get("/home",function(req,res){
 res.render("home.ejs");
});

Ap.get("/signup",function(req,res){
 res.render("signup.ejs");
});

Ap.get("/login",function(req,res){
 res.render("login.ejs",{msg:req.flash('loginMsg')});
});
  
Ap.post("/login",pssp.authenticate('login',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}));//post login

Ap.get("/tabs",function(req,res){
 res.render("tabs.ejs");
});


Ap.post('/signup',pssp.authenticate('register',{
 successRedirect:'/tabs',
 failureRedirect:'/home',
 failureFlash:true
}));//post

Ap.get('/profile',isLoggedIn,function(req,res){
 res.render('profile.ejs',{user:req.user});
});//get

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
