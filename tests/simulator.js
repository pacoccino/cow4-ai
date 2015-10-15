var mockMap = require('./mockMapInit.json');
var Communication = require('../client/modules/communication');
var GameState = require('../client/modules/gamestate');
var Simulator = require('../client/modules/simulator');
var IApoulet = require('../client/modules/iapoulet');

var chai = require('chai');
var expect = chai.expect;

var gamestate, simulator;

Communication.MyId = mockMap.iaList[0].id;

describe('Simulator', function() {

    beforeEach(function() {
        gamestate = new GameState();
        gamestate.fetchServerGameMap(mockMap);
        var iapoulet = new IApoulet(gamestate);
        simulator = new Simulator(gamestate, iapoulet);
    });

    it('simulates 0 turn', function(done) {
        simulator.simulateNTurns(0, function(estimatedGamestate) {

            expect(estimatedGamestate.currentTurn).to.equal(0);

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(12);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });

    it('simulates 1 turn', function(done) {
        simulator.simulateNTurns(1, function(estimatedGamestate) {

            expect(estimatedGamestate.currentTurn).to.equal(1);

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(12);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });

    it('simulates 2 turns', function(done) {
        simulator.simulateNTurns(2, function(estimatedGamestate) {

            expect(estimatedGamestate.currentTurn).to.equal(2);

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(11);
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });
    it('simulates 4 turns', function(done) {
        simulator.simulateNTurns(10, function(estimatedGamestate) {

            expect(estimatedGamestate.currentTurn).to.equal(10);

            var estimatedSheepCell = estimatedGamestate.getCellById(estimatedGamestate.players.getSheep().cellId);
            expect(estimatedSheepCell.x).to.equal(3); // TODO verifier
            expect(estimatedSheepCell.y).to.equal(12);
            done();
        })
    });

});