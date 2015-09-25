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
        maze = new Maze(map);
    });

    xit('depthFirst', function() {


        var source = map.getPlayerCell(game.players[0].id);
        var destination = map.getPlayerCell(game.players[1].id);

        maze.setSource(source);
        var paths = maze.depthFirst(destination);

        map.drawMap();
        console.log(paths);
    });

    it('breadthFirst', function() {


        var source = map.getPlayerCell(game.players[0].id);
        var destination = map.getPlayerCell(game.players[1].id);

        maze.setSource(source);
        maze.breadthFirst(destination);

        expect(maze.distances[source.y][source.x]).to.equal(0);
        expect(maze.distances[destination.y][destination.x]).to.equal(92);

        expect(maze.shortPath.length).to.equal(93);
        expect(maze.shortPath[0]).to.equal(source);
        expect(maze.shortPath[92]).to.equal(destination);

    });

});