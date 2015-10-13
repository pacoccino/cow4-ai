var mockMap = require('../map.json');
var GameState = require('../modules/gamestate');
var Player = require('../modules/player');
var GameController = require('../modules/gamecontroller');
var chai = require('chai');
var expect = chai.expect;

var game, gamestate;

describe('GameState', function() {

    beforeEach(function() {
        gamestate = new GameState();
    });

    it('get cell', function() {
        gamestate.fetchServerGameMap(mockMap);

        // (x,y)
        var cell = gamestate.getCell(0,0);
        // gamestate[y][x]
        expect(cell).to.equal(gamestate.fetchedMap[0][0]);

        var cellB = gamestate.getCell(1,0);
        expect(cellB).to.equal(gamestate.fetchedMap[0][1]);

        var cellC = gamestate.getCell(0,1);
        expect(cellC).to.equal(gamestate.fetchedMap[1][0]);

        var cellD = gamestate.getCell(1,1);
        expect(cellD).to.equal(gamestate.fetchedMap[1][1]);
    });

    it('get cell by id', function() {
        gamestate.fetchServerGameMap(mockMap);


        var cell = gamestate.getCellById(mockMap.cells[0][0].id);

        expect(cell).to.equal(gamestate.fetchedMap[0][0]);
    });

    it('fetch players', function() {
        gamestate.fetchServerGameMap(mockMap);

        expect(gamestate.players.players.length).to.equal(3);
        expect(gamestate.players.players[0].id).to.equal(mockMap.iaList[0].id);
        expect(gamestate.players.players[1].id).to.equal(mockMap.iaList[1].id);
        expect(gamestate.players.players[2].id).to.equal(mockMap.iaList[2].id);
        expect(gamestate.players.players[0].name).to.equal(mockMap.iaList[0].name);
        expect(gamestate.players.players[1].name).to.equal(mockMap.iaList[1].name);
        expect(gamestate.players.players[2].name).to.equal(mockMap.iaList[2].name);
    });

    it('fetch with existing', function() {
        gamestate.players.push(new Player({id:mockMap.iaList[0].id}));
        gamestate.fetchServerGameMap(mockMap);

        expect(gamestate.players.players.length).to.equal(3);
        expect(gamestate.players.players[0].id).to.equal(mockMap.iaList[0].id);
        expect(gamestate.players.players[1].id).to.equal(mockMap.iaList[1].id);
        expect(gamestate.players.players[2].id).to.equal(mockMap.iaList[2].id);
    });


    it('locate players', function() {
        gamestate.fetchServerGameMap(mockMap);

        expect(gamestate.players.players.length).to.equal(3);
        expect(gamestate.players.players[0].position.id).not.to.equal(0);
        expect(gamestate.players.players[1].position.id).not.to.equal(0);
        expect(gamestate.players.players[2].position.id).not.to.equal(0);

        expect(gamestate.players.players[0].position.x).to.equal(0);
        expect(gamestate.players.players[1].position.x).to.equal(gamestate.mapSize.width - 1);

        expect(gamestate.players.players[0].position.y).to.equal(0);
        expect(gamestate.players.players[1].position.y).to.equal(gamestate.mapSize.height - 1);

        expect(gamestate.players.players[0].position.id).to.equal(1424090482209);
        expect(gamestate.players.players[1].position.id).to.equal(1424090482833);
        expect(gamestate.players.players[2].position.id).to.equal(1424090482510);
    });

    it('fetchCells', function() {
        gamestate.fetchServerGameMap(mockMap);

        var firstCase = gamestate.fetchedMap[0][0];
        var firstCase2ndRow = gamestate.fetchedMap[1][0];

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
        gamestate.fetchServerGameMap(mockMap);

        for (var x = 0; x < gamestate.mapSize.width; x++) {
            var cell = gamestate.fetchedMap[0][x];
            expect(cell.walls.top).to.be.true;
        }
        for (var y = 0; y < gamestate.mapSize.height; y++) {
            var cell = gamestate.fetchedMap[y][0];
            expect(cell.walls.left).to.be.true;
        }

        for (var y = 0; y < gamestate.mapSize.height; y++) {
            var cell = gamestate.fetchedMap[y][gamestate.mapSize.width-1];
            expect(cell.walls.right).to.be.true;
        }
    });
    it('find adjacents', function() {
        gamestate.fetchServerGameMap(mockMap);

        var firstCase = gamestate.getCell(0,0);
        var bottomCase = gamestate.getCell(0,1);
        var rightCase = gamestate.getCell(1,0);

        expect(firstCase.adjacents.length).to.equal(2);

        expect(firstCase.adjacents[0]).to.equal(bottomCase);
        expect(firstCase.adjacents[1]).to.equal(rightCase);
    });

    it('clones 1', function() {
        var oldGameState, newGameState;
        oldGameState = new GameState();
        oldGameState.fetchServerGameMap(mockMap);

        oldGameState.currentTurn = 5;

        // Clone new gamestate, new one must reflect old one
        newGameState = oldGameState.clone();

        expect(newGameState.currentTurn).to.equal(oldGameState.currentTurn);

        expect(newGameState.allItems).not.to.equal(oldGameState.allItems);
        expect(newGameState.allItems.length).to.equal(oldGameState.allItems.length);
        expect(newGameState.allItems[0]).to.equal(oldGameState.allItems[0]);
        expect(newGameState.allItems[1]).to.equal(oldGameState.allItems[1]);

        expect(newGameState.mapSize.width).to.equal(oldGameState.mapSize.width);
        expect(newGameState.mapSize.height).to.equal(oldGameState.mapSize.height);

        expect(newGameState.players).not.to.equal(oldGameState.players);
        expect(newGameState.players.players).not.to.equal(oldGameState.players.players);
        expect(newGameState.players.players.length).to.equal(oldGameState.players.players.length);
        expect(newGameState.players.players[0].id).to.equal(oldGameState.players.players[0].id);
        expect(newGameState.players.players[1].id).to.equal(oldGameState.players.players[1].id);

        expect(newGameState.fetchedMap).not.to.equal(oldGameState.fetchedMap);
        expect(newGameState.fetchedMap.length).to.equal(oldGameState.fetchedMap.length);
        expect(newGameState.fetchedMap[0].length).to.equal(oldGameState.fetchedMap[0].length);
        expect(newGameState.fetchedMap[1].length).to.equal(oldGameState.fetchedMap[1].length);
        expect(newGameState.fetchedMap[0][0].id).to.equal(oldGameState.fetchedMap[0][0].id);
        expect(newGameState.fetchedMap[0][1].id).to.equal(oldGameState.fetchedMap[0][1].id);
    });

    it('clones 2', function() {
        var oldGameState, newGameState;
        oldGameState = new GameState();
        oldGameState.fetchServerGameMap(mockMap);

        oldGameState.currentTurn = 5;

        newGameState = oldGameState.clone();

        // Change new game state, must not reflect on old
        newGameState.currentTurn = 6;

        newGameState.allItems[0] = 45;
        newGameState.allItems.push(46);

        newGameState.players.players[0].id = 45;
        newGameState.players.push(new Player());

        newGameState.players.players[0].id = 45;
        newGameState.players.push(new Player());

        newGameState.fetchedMap[0][0].id = 656;


        expect(newGameState.currentTurn).not.to.equal(oldGameState.currentTurn);

        expect(newGameState.allItems.length).not.to.equal(oldGameState.allItems.length);
        expect(newGameState.allItems[0]).not.to.equal(oldGameState.allItems[0]);

        expect(newGameState.players.players.length).not.to.equal(oldGameState.players.players.length);
        expect(newGameState.players.players[0].id).not.to.equal(oldGameState.players.players[0].id);

        expect(newGameState.fetchedMap[0][0].id).not.to.equal(oldGameState.fetchedMap[0][0].id);
    });

    xit('drawMap', function() {
        gamestate.fetchServerGameMap(mockMap);
        gamestate.drawMap();
    });

});