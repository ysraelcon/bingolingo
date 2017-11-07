
var app= angular.module('laApp',['ngRoute',
          'laApp.home','laApp.login',
              'laApp.profile','laApp.edit'])

 .config(['$routeProvider','$locationProvider', 
   function($routeProvider,$locationProvider){
 $locationProvider.hashPrefix('');
 //$locationProvider.html5Mode(true);    
 $routeProvider.otherwise({redirectTo:'/'});
     
     
     
}]);//config

app.directive("appFondo",function(){
  return {
    strict:"E",
    templateUrl:"directive/fondo.html"
  };
});