//fecha: 16-09-18, 19-09

angular.module('la_App.profile',['ngRoute'])
 .config(['$routeProvider',//'$locationProvider',
          function($routeProvider){
            
    //$locationProvider.html5Mode(true);
    $routeProvider.when('/profile',
        {templateUrl:'profile/profile.html',
        controller:'profileCtrl'
    });//when
     //$locationProvider.html5Mode(true);
  }])//config
  .controller('profileCtrl',
      ["$scope","$http","$location","$route",
      function($scope,$http,$location,$route){
  
    //console.log('profilen');

    $http.get("/profile").then(function(res){
      console.log("get /profile :res")
      $scope.user= res.data;
    });//route get /profile
  
    $scope.logout=function(){
      console.log("logout")
       $http.get("/logout").then(function(res){
        $location.path("/");
       });//then
    };//logout

  
    $scope.editar_profile= function(user){
      console.log("edita profile")
      $scope.user= user;
      $scope.user.avatar= ig_prf_edi.src;
      console.log($scope.user); 
      
      $http.post("/edit",$scope.user).then(function(res){
        
        $scope.message= res.data.message;

        if($scope.message===undefined){
           //$location.path("/profile");
           $scope.edit= false;
           $route.reload();   
        }//if
      });//then post /edit

    };//edit
  
}]);//controller
