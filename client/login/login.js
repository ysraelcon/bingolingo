angular.module('laApp.login',['ngRoute'])
 .config(['$routeProvider',//'$locationProvider',
          function($routeProvider){
//$locationProvider.html5Mode(true);
            
 $routeProvider.when('/login',
        {templateUrl:'login/login.html',
         controller:'loginCtrl'
});//when
  //$locationProvider.html5Mode(true);
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