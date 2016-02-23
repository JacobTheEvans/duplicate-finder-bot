var app = angular.module("main",[]);

app.service("loadData", ["$http", function($http) {
  this.load = function(isSuc,isFail) {
    $http.get("/data/").then(isSuc,isFail);
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
    loadData.load($scope.setData,$scope.logError);
  };
  $scope.setData = function(response) {
    $scope.data = response.data;
    $scope.setConflictData(response.data);
  };
  $scope.setConflictData = function(data) {
    var result = [];
    for(var i = 0; i < data.length; i++) {
      var isDuplicate = false
      for(var x = 0; x < data.length; x++) {
        if(data[x]["hash"] == data[i]["hash"] && x != i) {
          isDuplicate = true;
          break;
        }
      }
      if(isDuplicate) {
        result.push(data[i]);
      }
    }
    $scope.conflictData = result;
  };
  $scope.logError = function(response) {
    console.log(response.status);
  };
  setTimeout(function() {
    $scope.updateMDL();
  }, 2000);
}]);
