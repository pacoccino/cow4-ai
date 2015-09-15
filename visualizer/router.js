"use strict";
var express = require('express');
var IAVizRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var mockMap = require('../map.json');
var Map = require('../modules/map');
var Maze = require('../modules/maze');
var GameController = require('../modules/gamecontroller');


var game, map, maze;

game = new GameController({});
map = new Map(game);
map.setGameMap(mockMap);
map.fetchPlayers();
map.localteNFetch();
maze = new Maze(map);

IAVizRouter.get('/', function(req, res, next) {
    res.send("api ok");
});

IAVizRouter.get('/getMap', function(req, res, next) {

    res.json(map.getSerializableMap());
});

IAVizRouter.get('/getPlayers', function(req, res, next) {

    res.json(game.players);
});

IAVizRouter.get('/getRoute', function(req, res, next) {


    var source = map.getPlayerCell(game.players[0].id);
    var destination = map.getPlayerCell(game.players[1].id);

    maze.setSource(source);
    var path = maze.depthFirst(destination);

    res.json(path);
});

IAVizRouter.get('/getDistances', function(req, res, next) {


    var source = map.getPlayerCell(game.players[0].id);

    maze.setSource(source);
    maze.breadthFirst();

    res.json(maze.distances);
});

IAVizRouter.get('/getShortestPath', function(req, res, next) {


    var source = map.getPlayerCell(game.players[0].id);
    var destination = map.getPlayerCell(game.players[1].id);

    maze.setSource(source);
    maze.breadthFirst(destination);

    res.json(maze.getSerializablePath());
});

module.exports = IAVizRouter;
