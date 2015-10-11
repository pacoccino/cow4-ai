var app = angular.module('IAViz', []);

app.controller('mainCtrl', function($scope, IAVizConnector) {

    IAVizConnector.getMap().then(function(data) {
        $scope.map = data.data;

        IAVizConnector.getShortestRoutes().then(function(data) {
            $scope.shortestRoutes = data.data;
            $scope.showPath($scope.shortestRoutes[0].path);
        });

        IAVizConnector.getAllRoutes().then(function(data) {
            $scope.allRoutes = data.data;
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

        if(cell.isPath)
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

    $scope.showPath = function(path) {
        if(!path) {
            path = $scope.shortestRoute.path;
        }
        for (var y = 0; y < $scope.map.length; y++) {
            var line = $scope.map[y];
            for (var x = 0; x < line.length; x++) {
                var cell = line[x];
                cell.isPath = false;
            }
        }
        for(var i=0; i<path.length; i++) {
            var cell = path[i];
            $scope.map[cell.y][cell.x].isPath = true;
        }
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

    var getDistances = function() {

        var request = {
            method: 'GET',
            url:  host + 'getDistances'
        };

        return $http(request);
    };

    var getShortestRoutes = function() {

        var request = {
            method: 'GET',
            url:  host + 'getShortestRoutes'
        };

        return $http(request);
    };

    var getAllRoutes = function() {

        var request = {
            method: 'GET',
            url:  host + 'getAllRoutes'
        };

        return $http(request);
    };

    return {
        getMap: getMap,
        getDistances: getDistances,
        getShortestRoutes: getShortestRoutes,
        getAllRoutes: getAllRoutes
    };
});
