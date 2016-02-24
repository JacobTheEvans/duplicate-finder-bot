var app = angular.module("main",[]);

app.service("loadData", ["$http", function($http) {
  this.loadAll = function(isSuc,isFail) {
    $http.get("/alldata/").then(isSuc,isFail);
  };
  this.loadConflicts = function(isSuc,isFail) {
    $http.get("/conflictsdata").then(isSuc,isFail);
  };
}]);

app.controller("mainController", ["$scope", "loadData", function($scope,loadData) {
  $scope.local = "Conflicts";
  $scope.data = [];
  $scope.conflictData = [];
  $scope.setLocation = function(local) {
    $scope.local = local;
  };
  $scope.updateMDL = function() {
    componentHandler.upgradeAllRegistered();
  };
  $scope.load = function() {
    loadData.loadAll($scope.setAllData,$scope.logError);
    loadData.loadConflicts($scope.setConflictData,$scope.logError);
  };
  $scope.setAllData = function(response) {
    $scope.data = response.data;
  };
  $scope.setConflictData = function(response) {
    $scope.conflictData = response.data;
  };
  $scope.logError = function(response) {
    console.log(response.status);
  };
  setTimeout(function() {
    $scope.updateMDL();
  }, 2000);
}]);
