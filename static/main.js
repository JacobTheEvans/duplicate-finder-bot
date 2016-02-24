var app = angular.module("main",[]);

app.service("loadData", ["$http", function($http) {
  this.load = function(isSuc,isFail) {
    $http.get("/data/").then(isSuc,isFail);
  };
}]);

app.controller("mainController", ["$scope", "loadData", function($scope,loadData) {
  $scope.data = [];
  $scope.conflictData = [];
  $scope.updateMDL = function() {
    componentHandler.upgradeAllRegistered();
  };
  $scope.load = function() {
    loadData.load($scope.setData,$scope.logError);
  };
  $scope.setData = function(response) {
    $scope.data = response.data;
  };
  $scope.logError = function(response) {
    console.log(response.status);
  };
  setTimeout(function() {
    $scope.updateMDL();
  }, 2000);
}]);
