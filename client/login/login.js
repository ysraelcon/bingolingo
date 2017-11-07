angular.module('laApp.login',['ngRoute'])

 .config(['$routeProvider',function($routeProvider){

 $routeProvider.when('/login',{
   
templateUrl:'login/login.html',
controller:'loginCtrl'
});//when
}])//config

.controller('loginCtrl',
           ["$scope","$http","$location",
function($scope,$http,$location){

  $scope.logiN=function(){
 $http.post("/login",$scope.user)
.then(function(res){
 $scope.message=res.data.message;
if($scope.message===undefined){
 $location.path("/profile");
}//if
});//then
};//login
  
}]);//controller