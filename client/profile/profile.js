angular.module('myApp.profile',['ngRoute'])
 .config(['$routeProvider',function($routeProvider){

 $routeProvider.when('/profile',{
templateUrl:'profile/profile.html',
controller:'profileCtrl'
});//when
}])//config

.controller('profileCtrl',
            ["$scope","$http","$location",
function($scope,$http,$location){
 console.log('profilen');
  
  $http.get("/profile")
.then(function(res){
 $scope.user=res.data;
});
  
$scope.logout=function(){
 $http.get("/logout").then(function(res){
  $location.path("/");
});
};
  
}]);//controller