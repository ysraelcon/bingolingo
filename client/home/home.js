angular.module('laApp.home',['ngRoute'])
 .config(['$routeProvider',//'$locationProvider',
          function($routeProvider){
//$locationProvider.html5Mode(true);
            
 $routeProvider.when('/',
      {templateUrl:'home/home.html',
       controller:'homeCtrl'
});//when
   // $locationProvider.html5Mode(true);
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