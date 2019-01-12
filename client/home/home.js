//fecha: 16-09-18, 18-09

angular.module('la_App.home',['ngRoute'])
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

          
      $scope.entrar_login= function(){
        console.log("entra login")
        $http.post("/login",$scope.user).then(function(res){
  
          $scope.message= res.data.message;

          if($scope.message===undefined){
           $location.path("/profile");
          }//if
  
        });//then
      };//login


      $scope.olvido_password= function(){
        console.log("olvida password")
        if(typeof($scope.user)=="undefined"||
          $scope.user.email==""){
          alert("write your email in login");
        }else{

          $http.post("/mail",$scope.user).then(function(res){

            //console.log(res);
            //alert("Check your email for get your password")
            $scope.message= res.data.message;
          });//then post email
        }//else

      };//olvido_password
          
          
      $scope.entrar_sign_up= function(){
        console.log("entra sign up")
        $http.post("/sign_up",$scope.user).then(function(res){

          $scope.message= res.data.message;

          if($scope.message===undefined){
           $location.path("/profile");
          }//if
        });//then
      };//sign_up
  
}]);//controller
