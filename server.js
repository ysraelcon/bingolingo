
var Exp = require('express');
var Ap = Exp();
var expejsly= require('express-ejs-layouts');

// http://expressjs.com/en/starter/static-files.html
Ap.use(Exp.static(__dirname+'/public'));

Ap.set("view engine","ejs");
Ap.use(expejsly);

//rutas
//Ap.use(require('./app/routes'));
Ap.get("/",function(req,res){
 res.render("home");
});

// listen for requests :)
var listener = Ap.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
