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

    }
    return {
        getMap: getMap
    };
});
