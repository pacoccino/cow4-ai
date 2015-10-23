'use strict';
var express = require('express');
var fs = require('fs');
var IAVizRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var mockMap = require('../tests/mockMapInit.json');
var GameState = require('../client/modules/gamestate');
var Maze = require('../client/modules/maze');


var gamestate, maze;

gamestate = new GameState();
gamestate.fetchServerGameMap(mockMap);
maze = new Maze(gamestate);

var logPath = 'logs';
var listOfTurns = fs.readdirSync(logPath);


IAVizRouter.get('/', function(req, res, next) {
    res.send('api ok');
});

IAVizRouter.get('/getMap', function(req, res, next) {

    res.json(gamestate.fetchedMap);
});
IAVizRouter.get('/getPlayers', function(req, res, next) {

    res.json(gamestate.players.players);
});

IAVizRouter.get('/getTurns', function(req, res, next) {

    res.json(listOfTurns);
});

IAVizRouter.get('/setTurn/:id', function(req, res, next) {

    var gamemap = null;
    if(!listOfTurns[req.params.id]) {
        res.send("Unknown turn id");
        return;
    }

    fs.readFile(logPath + '/' + listOfTurns[req.params.id], function(err, file) {

        gamemap = JSON.parse(file);
        gamestate = new GameState();
        gamestate.fetchServerGameMap(gamemap);
        maze = new Maze(gamestate);
        res.json(gamestate.fetchedMap);
    });

});

IAVizRouter.get('/getDistances', function(req, res, next) {


    var source = gamestate.getCellById(gamestate.players.players[0].cellId);

    maze.computeWeights(source);

    res.json(maze.distances);
});

IAVizRouter.get('/getShortestRoutes', function(req, res, next) {


    var source = gamestate.getCellById(gamestate.players.players[0].cellId);
    var destination = gamestate.getCellById(gamestate.players.players[1].cellId);

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


    var source = gamestate.getCellById(gamestate.players.players[0].cellId);
    var destination = gamestate.getCellById(gamestate.players.players[1].cellId);

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
