"use strict";
var express = require('express');
var IAVizRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var mockMap = require('../map.json');
var Map = require('../modules/map');
var GameController = require('../modules/gamecontroller');


var game, map;

game = new GameController({});
map = new Map(game);
map.setGameMap(mockMap);
map.fetchPlayers();
map.localteNFetch();

IAVizRouter.get('/', function(req, res, next) {
    res.send("api ok");
});

IAVizRouter.get('/getMap', function(req, res, next) {

    res.json(map.getMap());
});

module.exports = IAVizRouter;
