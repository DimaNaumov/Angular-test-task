'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', ['ui.bootstrap']);
//myApp.config(['$httpProvider', function($httpProvider) {
//  $httpProvider.defaults.headers.put = {
//    'Access-Control-Allow-Origin': '*',
//    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//    'Access-Control-Allow-Headers': 'Content-Type'
//  };
//  $httpProvider.defaults.useXDomain = true;
//  delete $httpProvider.defaults.headers.common['X-Requested-With'];
//  delete $httpProvider.defaults.headers['Origin'];
//}
//]);
myApp.controller("timeCtrl", function($scope, $http){
  $scope.cities = [{name: 'Moscow, MC, Russia', zone: 3}];
  $scope.cityList = [];
  $scope.currentCity = {};
  $scope.editCity = {};
  $scope.editMode = false;
  $scope.hourInMs = 60*60*1000; // In 1/1000 seconds
  var timediff = new Date().getTimezoneOffset();
  timediff *= 60000; // ms in minutes
  var time = Date.now();
  $scope.time = time + timediff; // GMT = 0
  $scope.add = function(){
    $scope.cities.push({
      name: $scope.currentCity.name,
      zone: $scope.currentCity.zone
    });
    $scope.currentCity = {};
  };

  function updateTime(){
    var time = Date.now();
    $scope.time = time + timediff;
    $scope.$apply();
  };
  setInterval(updateTime, 1000);
  $scope.edit = function(city){
    $scope.editMode = true;
    $scope.editCity = city;
    $scope.currentCity.name = $scope.editCity.name;
    $scope.currentCity.zone = $scope.editCity.zone;
  };

  $scope.save = function(){
    $scope.editMode = false;
    $scope.editCity.name =  $scope.currentCity.name;
    $scope.editCity.zone =  $scope.currentCity.zone;
    $scope.currentCity = {};
    $scope.editCity = {};

  };

  $scope.cancel = function(){
    $scope.editMode = false;
    $scope.currentCity = {};
    $scope.editCity = {};
  };

  $scope.delete = function(city){
    var cityPosition = $scope.cities.indexOf(city);
    $scope.cities.splice(cityPosition, 1);
  };

  $scope.getCityList = function(cityName) {
    if (cityName.length < 3) {
      $scope.cityList = [];
      return;
    }

    $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK&q=" + cityName)
        .success(function(data) {
          $scope.cityList = data || [];
        })

  };

});
