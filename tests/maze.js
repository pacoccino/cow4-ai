var mockMap = require('../map.json');
var Map = require('../modules/map');
var Maze = require('../modules/maze');
var GameController = require('../modules/gamecontroller');

var chai = require('chai');
var expect = chai.expect;

var game, map, maze;

describe('Map', function() {

    beforeEach(function() {
        game = new GameController({});
        map = new Map(game);
        map.setGameMap(mockMap);
        map.fetchPlayers();
        map.localteNFetch();
        maze = new Maze(map);
    });

    it('getPaths', function() {


        var source = map.getFetchedCell(0,0);
        var destination = map.getFetchedCell(map.mapSize.width-1, map.mapSize.height-1);
        var paths = maze.getPath(source, destination);

        map.drawMap();
        console.log(paths);
    });

});