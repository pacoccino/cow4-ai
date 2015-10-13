var mockMap = require('./mockMap.json');
var GameState = require('../client/modules/gamestate');
var Maze = require('../client/modules/maze');
var GameController = require('../client/modules/gamecontroller');

var chai = require('chai');
var expect = chai.expect;

var game, map, maze;

describe('Maze', function() {

    beforeEach(function() {
        map = new GameState();
        map.fetchServerGameMap(mockMap);
        maze = new Maze(map);
    });

    it('breadthFirst', function() {


        var source = map.getCellById(map.players.players[0].cellId);
        var destination = map.getCellById(map.players.players[1].cellId);

        maze.computeWeights(source);

        expect(maze.nodes[source.y][source.x].distance).to.equal(0);
        expect(maze.nodes[destination.y][destination.x].distance).to.equal(92);
    });

    it('shortPath', function() {


        var source = map.getCellById(map.players.players[0].cellId);
        var destination = map.getCellById(map.players.players[1].cellId);

        maze.computeWeights(source);
        var route = maze.getShortestRoutes(destination)[0];

        expect(route.path.length).to.equal(92);
        expect(route.path[0].x).to.equal(0);
        expect(route.path[0].y).to.equal(1);
        expect(route.path[91].x).to.equal(destination.x);
        expect(route.path[91].y).to.equal(destination.y);
        expect(route.cellPath[91]).to.equal(destination);

    });

});