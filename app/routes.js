var Exp=require('express');
var Rtr=Exp.Router();

module.exports=Rtr;

Rtr.get('/',function(req,res){
  res.render("home");
});