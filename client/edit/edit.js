angular.module('laApp.edit',['ngRoute'])

 .config(['$routeProvider',function($routeProvider){

 $routeProvider.when('/edit',{
   
templateUrl:'edit/edit.html',
controller:'editCtrl'
});//when
}])//config

.controller('editCtrl',
           ["$scope","$http","$location",
function($scope,$http,$location){

  $http.get("/edit")
.then(function(res){
 $scope.user=res.data;
});
  
  $scope.ediT=function(user){
    $scope.user=user;
 $http.post("/edit",$scope.user)
.then(function(res){
 $scope.message=res.data.message;
if($scope.message===undefined){
 $location.path("/profile");
}//if
});//then
};//login
  
}]);//controller