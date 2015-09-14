var app = angular.module("IAViz", []);

app.controller("mainCtrl", function($scope, IAVizConnector) {

    IAVizConnector.getMap().then(function(data) {
        $scope.map = data.data;
    });

    $scope.getCellStyle = function(cell) {
        var style = {};

        if(cell.occupantId)
            style.backgroundColor = "yellow";

        if(cell.isSheep)
            style.backgroundColor = "red";

        if(cell.isPath)
            style.backgroundColor = "green";

        return style;
    };

    IAVizConnector.getRoute().then(function(data) {
        var path = data.data;
        for(var i=0; i<path.length; i++) {
            var cell = path[i];
            $scope.map[cell.y][cell.x].isPath = true;
        }
    });
});

app.service("IAVizConnector", function($http) {

    var host = "http://localhost:1000/api/";


    var getMap = function() {

        var request = {
            method: "GET",
            url:  host + 'getMap'
        };

        return $http(request);
    };

    var getRoute = function() {

        var request = {
            method: "GET",
            url:  host + 'getRoute'
        };

        return $http(request);
    };

    return {
        getMap: getMap,
        getRoute: getRoute
    };
});
