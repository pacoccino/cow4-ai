var app = angular.module('IAViz', []);

app.controller('mainCtrl', function($scope, IAVizConnector) {

    IAVizConnector.getMap().then(function(data) {
        $scope.map = data.data;

        IAVizConnector.getRoute().then(function(data) {
            var path = data.data;
            for(var i=0; i<path.length; i++) {
                var cell = path[i];
                $scope.map[cell.y][cell.x].isPath = true;
            }
        });
        IAVizConnector.getShortPath().then(function(data) {
            var path = data.data;
            for(var i=0; i<path.length; i++) {
                var cell = path[i];
                $scope.map[cell.y][cell.x].isShortestPath = true;
            }
        });

        IAVizConnector.getDistances().then(function(data) {
            var nodes = data.data;
            for(var y=0; y<nodes.length; y++) {
                for (var x = 0; x < nodes[y].length; x++) {
                    var node = nodes[y][x];
                    $scope.map[y][x].distance = node;
                }
            }
        });

    });

    var cellSize = 20;
    var borderType = '2px solid black';
    $scope.getCellStyle = function(cell) {
        var style = {};



        if(cell.isPath)
            style.backgroundColor = 'yellow';

        if(cell.isShortestPath)
            style.backgroundColor = 'green';

        if(cell.occupantId)
            style.backgroundColor = 'blue';

        if(cell.isSheep)
            style.backgroundColor = 'red';

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

app.service('IAVizConnector', function($http) {

    var host = 'http://localhost:4000/api/';


    var getMap = function() {

        var request = {
            method: 'GET',
            url:  host + 'getMap'
        };

        return $http(request);
    };

    var getRoute = function() {

        var request = {
            method: 'GET',
            url:  host + 'getRoute'
        };

        return $http(request);
    };
    var getDistances = function() {

        var request = {
            method: 'GET',
            url:  host + 'getDistances'
        };

        return $http(request);
    };
    var getShortPath = function() {

        var request = {
            method: 'GET',
            url:  host + 'getShortestPath'
        };

        return $http(request);
    };

    return {
        getMap: getMap,
        getRoute: getRoute,
        getDistances: getDistances,
        getShortPath: getShortPath
    };
});
