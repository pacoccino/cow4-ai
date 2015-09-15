var app = angular.module("IAViz", []);

app.controller("mainCtrl", function($scope, IAVizConnector) {

    IAVizConnector.getMap().then(function(data) {
        $scope.map = data.data;

        IAVizConnector.getRoute().then(function(data) {
            var path = data.data;
            for(var i=0; i<path.length; i++) {
                var cell = path[i];
                $scope.map[cell.y][cell.x].isPath = true;
            }
        });
    });

    var cellSize = 20;
    var borderType = "2px solid black";
    $scope.getCellStyle = function(cell) {
        var style = {};



        if(cell.isPath)
            style.backgroundColor = "green";

        if(cell.isSheep)
            style.backgroundColor = "red";

        if(cell.occupantId)
            style.backgroundColor = "yellow";

        style.left = cellSize * cell.x + 'px';
        style.top = cellSize * cell.y + 'px';
        style.width = cellSize + 'px';
        style.height = cellSize + 'px';

        if(cell.walls.top)
            style.borderTop = borderType;
        if(cell.walls.bottom)
            style.borderBottom = borderType;
        if(cell.walls.left)
            style.borderLeft = borderType;
        if(cell.walls.right)
            style.borderRight = borderType;

        return style;
    };

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
