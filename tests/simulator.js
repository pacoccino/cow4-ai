var mockMap = require('./mockMapInit.json');
var Communication = require('../client/modules/communication');
var GameState = require('../client/modules/gamestate');
var Simulator = require('../client/modules/simulator');

var chai = require('chai');
var expect = chai.expect;

var gamestate, simulator;

Communication.MyId = mockMap.iaList[0].id;

describe('Simulator', function() {

    beforeEach(function() {
        gamestate = new GameState();
        gamestate.fetchServerGameMap(mockMap);
        simulator = new Simulator(gamestate);
    });

    it('simulates 1 turn', function(done) {
        simulator.simulateNTurns(1, function(estimatedGamestate) {

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(12);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });

    it('simulates 2 turns', function(done) {
        simulator.simulateNTurns(2, function(estimatedGamestate) {

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(12);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });
    it('simulates 4 turns', function(done) {
        simulator.simulateNTurns(10, function(estimatedGamestate) {

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(4);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });

});