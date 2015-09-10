var mockMap = require('../map.json');
var Map = require('../modules/map');
var Player = require('../modules/player');
var GameController = require('../modules/gamecontroller');
var chai = require('chai');
var expect = chai.expect;

var game, map;

describe('Map', function() {

    beforeEach(function() {
        game = new GameController({});
        map = new Map(game);
    });

    it('fetch players', function() {
        map.setMap(mockMap);
        map.fetchPlayers();

        expect(game.players.length).to.equal(3);
        expect(game.players[0].id).to.equal(mockMap.iaList[0].id);
        expect(game.players[1].id).to.equal(mockMap.iaList[1].id);
        expect(game.players[2].id).to.equal(mockMap.iaList[2].id);
        expect(game.players[0].name).to.equal(mockMap.iaList[0].name);
        expect(game.players[1].name).to.equal(mockMap.iaList[1].name);
        expect(game.players[2].name).to.equal(mockMap.iaList[2].name);
    });

    it('fetch with existing', function() {
        game.players.push(new Player({id:mockMap.iaList[0].id}));
        map.setMap(mockMap);
        map.fetchPlayers();

        expect(game.players.length).to.equal(3);
        expect(game.players[0].id).to.equal(mockMap.iaList[0].id);
        expect(game.players[1].id).to.equal(mockMap.iaList[1].id);
        expect(game.players[2].id).to.equal(mockMap.iaList[2].id);
    });


    it('locate players', function() {
        map.setMap(mockMap);
        map.fetchPlayers();
        map.locatePlayers();

        expect(game.players.length).to.equal(3);
        expect(game.players[0].position.id).not.to.equal(0);
        expect(game.players[1].position.id).not.to.equal(0);
        expect(game.players[2].position.id).not.to.equal(0);

        expect(game.players[0].position.x).to.equal(0);
        expect(game.players[1].position.x).to.equal(map.mapSize.width - 1);

        expect(game.players[0].position.y).to.equal(0);
        expect(game.players[1].position.y).to.equal(map.mapSize.height - 1);

        expect(game.players[0].position.id).to.equal(1424090482209);
        expect(game.players[1].position.id).to.equal(1424090482833);
        expect(game.players[2].position.id).to.equal(1424090482510);
    });

    it('fetchCells', function() {
        map.setMap(mockMap);
        map.fetchCells();

        var firstCase = map.fetchedMap[0];
        var firstCase2ndRow = map.fetchedMap[map.mapSize.width];

        expect(firstCase.id).to.equal(mockMap.cells[0][0].id);
        expect(firstCase.x).to.equal(0);
        expect(firstCase.y).to.equal(0);
        expect(firstCase2ndRow.id).to.equal(mockMap.cells[1][0].id);
        expect(firstCase2ndRow.x).to.equal(0);
        expect(firstCase2ndRow.y).to.equal(1);

        expect(firstCase.walls.top).to.be.true;
        expect(firstCase.walls.bottom).to.be.false;
        expect(firstCase.walls.left).to.be.true;
        expect(firstCase.walls.right).to.be.false;
        expect(firstCase.ways.top).to.be.false;
        expect(firstCase.ways.bottom).to.be.true;
        expect(firstCase.ways.left).to.be.false;
        expect(firstCase.ways.right).to.be.true;
    });

    it('fetchCells2', function() {
        map.setMap(mockMap);
        map.fetchCells();

        for (var x = 0; x < map.mapSize.width; x++) {
            var cell = map.fetchedMap[x];
            expect(cell.walls.top).to.be.true;
        }
        for (var y = 0; y < map.mapSize.height; y++) {
            var cell = map.fetchedMap[y * map.mapSize.height];
            expect(cell.walls.left).to.be.true;
        }

        for (var y = 0; y < map.mapSize.height; y++) {
            var cell = map.fetchedMap[y * map.mapSize.height + map.mapSize.width-1];
            expect(cell.walls.right).to.be.true;
        }
    });

    it('drawCells', function() {
        map.setMap(mockMap);
        map.fetchCells();
        map.fetchPlayers();
        map.drawCells();

    });

});