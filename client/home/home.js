angular.module('laApp.home',['ngRoute'])

 .config(['$routeProvider',function($routeProvider){

 $routeProvider.when('/',{
   
templateUrl:'home/home.html',
controller:'homeCtrl'
});//when
}])//config

.controller('homeCtrl',
           ["$scope","$http","$location",
function($scope,$http,$location){

  $scope.signuP=function(){
 $http.post("/signup",$scope.user)
.then(function(res){
 $scope.message=res.data.message;
if($scope.message===undefined){
 $location.path("/profile");
}//if
});//then
};//login
  
}]);//controller