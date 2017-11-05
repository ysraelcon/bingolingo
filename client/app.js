angular.module('myApp',['ngRoute',
          'myApp.login','myApp.register',
              'myApp.profile'])

 .config(['$routeProvider','$locationProvider', 
   function($routeProvider,$locationProvider){
 $locationProvider.hashPrefix('');
 $routeProvider.otherwise({redirectTo:'/login'});
}])//config