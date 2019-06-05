
var app= angular.module('la_App',
[
'ngRoute',
'la_App.home',
'la_App.profile'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
{
$locationProvider.hashPrefix('');
//$locationProvider.html5Mode(true);    
$routeProvider.otherwise({redirectTo:'/'});
}]);//config

/*
app.directive("appFondo",function(){
return {strict:"E",
templateUrl:"directive/fondo.html"};
});//app-fondo */

app.directive("appEditProfile", function()
{
return {strict: "E", templateUrl: "directive/edit.html"};
});//app-edit-profile

/*
angular.module("la_App").controller("vm", function($scope, $element) {
  console.log("la app ppp")
  console.log($scope)
  console.log($element)
  vm = $scope;
  
  //APPEND for DEMO purposes
  vm.html = '<script>alert("Hello John!");</script><p>Loaded</p>';
  $element.append(vm.html);
  console.log($element.find("script"))
  //FIND script and eval 
  var js = $element.find("script")[0].innerHTML;
  eval(js);
  
});
*/

/*
app.directive('script', function() {
  return { 
    restrict: 'E',
    scope: false,
    link: function(scope, elem, attr) {
      console.log("scriptttt")
      console.log(elem)
    if (elem[0].className=='ng-scope') {//attr.type=='text/javascript-lazy'
      console.log("ng-scopeeeeee")
      console.log(elem.text())
      var s= document.createElement("script")
      s.src= elem[0].src;
      s.innerHTML= elem.text()
      document.getElementsByTagName("body")[0].appendChild(s)
      
      var code = elem.text();
      var f = new Function(code);
      f();
      
    }
  }
  }
})

*/