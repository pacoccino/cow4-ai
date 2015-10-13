'use strict';
var express = require('express');
var IAVizRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var mockMap = require('../map.json');
var GameState = require('../modules/gamestate');
var Maze = require('../modules/maze');
var GameController = require('../modules/gamecontroller');


var game, map, maze;

map = new GameState();
map.fetchServerGameMap(mockMap);
maze = new Maze(map);

IAVizRouter.get('/', function(req, res, next) {
    res.send('api ok');
});

IAVizRouter.get('/getMap', function(req, res, next) {

    res.json(map.getSerializableMap());
});

IAVizRouter.get('/getPlayers', function(req, res, next) {

    res.json(game.players);
});


IAVizRouter.get('/getDistances', function(req, res, next) {


    var source = map.players.getPlayerCell(map.players.players[0].id);

    maze.computeWeights(source);

    res.json(maze.distances);
});

IAVizRouter.get('/getShortestRoutes', function(req, res, next) {


    var source = map.players.getPlayerCell(map.players.players[0].id);
    var destination = map.players.getPlayerCell(map.players.players[1].id);

    maze.computeWeights(source);
    var routes = maze.getShortestRoutes(destination);

    var paths = [];
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        paths.push(route.getPublic());
    }

    res.json(paths);
});

IAVizRouter.get('/getAllRoutes', function(req, res, next) {


    var source = map.players.getPlayerCell(map.players.players[0].id);
    var destination = map.players.getPlayerCell(map.players.players[1].id);

    maze.computeWeights(source);
    var routes = maze.getAllRoutes(destination);

    var paths = [];
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        paths.push(route.getPublic());
    }

    res.json(paths);
});

module.exports = IAVizRouter;
