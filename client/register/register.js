angular.module('myApp.register',['ngRoute'])
 .config(['$routeProvider',function($routeProvider){

 $routeProvider.when('/register',{
   
templateUrl:'register/register.html',
controller:'registerCtrl'
});//when
}])//config

.controller('registerCtrl',
            ["$scope","$http","$location",
function($scope,$http,$location){

$scope.register= function(){
 $http.post("/register",$scope.user)
  .then(function(res){
 $scope.message= res.data.message;
if($scope.message === undefined){
$location.path("/profile");
}//if
});//then
};//f scope http loc
}]);//controller