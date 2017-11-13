angular.module('laApp.profile',['ngRoute'])
 .config(['$routeProvider',
          function($routeProvider){

 $routeProvider.when('/profile',{
templateUrl:'profile/profile.html',
controller:'profileCtrl'
});//when
   //$locationProvider.html5Mode(true);
}])//config

.controller('profileCtrl',
            ["$scope","$http","$location","$route",
function($scope,$http,$location,$route){
 console.log('profilen');
  
  $http.get("/profile")
.then(function(res){
 $scope.user=res.data;
});//route get /profile
  
$scope.logout=function(){
 $http.get("/logout").then(function(res){
  $location.path("/");
});
};//logout
  
  
  $scope.ediT=function(user){
    $scope.user=user;
    
 $http.post("/edit",$scope.user)
.then(function(res){
 $scope.message=res.data.message;
if($scope.message===undefined){
 //$location.path("/profile");
 $scope.edit=false;
 $route.reload();   
}//if
});//then post /edit

};//edit
  
}]);//controller