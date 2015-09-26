var mockMap = require('../map.json');
var Map = require('../modules/map');
var GameController = require('../modules/gamecontroller');
var Action = require('../modules/action');
var chai = require('chai');
var expect = chai.expect;

var action;

describe('Action', function() {

    beforeEach(function() {
        action = new Action();
    });

    it('creates', function() {
        expect(action.type).to.be.defined;
        expect(action.value).to.be.defined;
    });

    it('sets move action', function() {
        action.move(12);

        expect(action.type).to.equal('move');
        expect(action.value).to.equal(12);
    });


    it('get server action', function() {
        action.move(12);

        var serverAction = action.getServerAction();

        expect(serverAction.type).to.equal('move');
        expect(serverAction.target).to.equal(12);
    });

    it('executes move', function() {
        var game = new GameController({});
        var map = new Map(game);
        map.setGameMap(mockMap);

        action.move(mockMap.cells[0][1].id);

        var player = game.players[0];
        action.executeOnMap(map, player);

        expect(map.getCell(0, 0).occupantId).to.be.null;
        expect(map.getCell(1, 0).occupantId).to.equal(player.id);
    });
});