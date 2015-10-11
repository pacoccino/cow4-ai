var mockMap = require('../map.json');
var GameState = require('../modules/gamestate');
var Maze = require('../modules/maze');
var GameController = require('../modules/gamecontroller');

var chai = require('chai');
var expect = chai.expect;

var game, map, maze;

describe('Maze', function() {

    beforeEach(function() {
        game = new GameController({});
        map = new GameState(game);
        map.fetchServerGameMap(mockMap);
        maze = new Maze(map);
    });

    xit('depthFirst', function() {


        var source = map.players.getPlayerCell(map.players.players[0].id);
        var destination = map.players.getPlayerCell(map.players.players[1].id);

        maze.setSource(source);
        var paths = maze.depthFirst(destination);

        map.drawMap();
        console.log(paths);
    });

    it('breadthFirst', function() {


        var source = map.players.getPlayerCell(map.players.players[0].id);
        var destination = map.players.getPlayerCell(map.players.players[1].id);

        maze.computeWeights(source);

        expect(maze.nodes[source.y][source.x].distance).to.equal(0);
        expect(maze.nodes[destination.y][destination.x].distance).to.equal(92);
    });

    it('shortPath', function() {


        var source = map.players.getPlayerCell(map.players.players[0].id);
        var destination = map.players.getPlayerCell(map.players.players[1].id);

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