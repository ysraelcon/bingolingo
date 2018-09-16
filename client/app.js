//fecha: 16-09-18

var app= angular.module('laApp',
          ['ngRoute','laApp.home',
           'laApp.profile'])

 .config(['$routeProvider','$locationProvider', 
   function($routeProvider,$locationProvider){
     
 $locationProvider.hashPrefix('');
 //$locationProvider.html5Mode(true);    
 $routeProvider.otherwise({redirectTo:'/'});
          
}]);//config

app.directive("appFondo",function(){
  return {strict:"E",
    templateUrl:"directive/fondo.html"};
});//app-fondo

app.directive("appEditProfile",function(){
  return {strict:"E",
    templateUrl:"directive/edit.html"};
});//app-edit-profile