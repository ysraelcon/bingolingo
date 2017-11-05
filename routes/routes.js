module.exports=function(Ap,pssp){
 Ap.get('/',function(req,res){
  //res.render('index.ejs');
   ///res.json("autenticacion app, registrate");
});//get

Ap.get('/login',function(req,res){
 res.json({message:req.flash('loginMessage')});
 //res.render('login.ejs',{message:req.flash('loginMessage')});

});//get

Ap.post('/login',pssp.authenticate('login',{
 successRedirect:'/profile',
 failureRedirect:'/login',
 failureFlash:true
}));//post

Ap.get('/register',function(req,res){
 res.json({message:req.flash('registerMessage')});
  //res.render('register.ejs',{message:req.flash('registerMessage')});
});//get

Ap.post('/register',pssp.authenticate('register',{
 successRedirect:'/profile',
 failureRedirect:'/register',
 failureFlash:true
}));//post

Ap.get('/profile',isLoggedIn,function(req,res){
 res.json(req.user);//{user:req.user}
 //res.render('profile.ejs',{user:req.user});
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

