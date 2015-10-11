var mockMap = require('../map.json');
var GameState = require('../modules/gamestate');
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


    it('get server action move', function() {
        action.move(12);

        var serverAction = action.getServerAction();

        expect(serverAction.type).to.equal('move');
        expect(serverAction.target).to.equal(12);
    });

    it('get server action get item', function() {
        action.getItem();

        var serverAction = action.getServerAction();

        expect(serverAction.type).to.equal('getItem');
    });

    it('get server action use item', function() {
        action.useItem(12);

        var serverAction = action.getServerAction();

        expect(serverAction.type).to.equal('useItem');
        expect(serverAction.item.type).to.equal(12);
    });

    it('executes move', function() {
        var game = new GameController({});
        var map = new GameState(game);
        map.fetchServerGameMap(mockMap);

        action.move(mockMap.cells[0][1].id);

        var player = map.players.players[0];
        action.executeOnMap(map, player);

        expect(map.getCell(0, 0).occupantId).to.be.null;
        expect(map.getCell(1, 0).occupantId).to.equal(player.id);
    });
});