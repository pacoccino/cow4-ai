var mockMap = require('../map.json');
var Cell = require('../modules/cell');
var GameState = require('../modules/gamestate');
var GameController = require('../modules/gamecontroller');

var chai = require('chai');
var expect = chai.expect;

var cell, game, map;

var serverCell = {
    "id": 1424090482209,
    "occupant": {
        "invisibilityDuration": 0,
        "pm": 1,
        "id": 1441909743098,
        "name": "pacia",
        "avatar": "http://2.gravatar.com/avatar/543b0381d275eb738a562a1bd35dea2a",
        "items": []
    },
    "bottom": 1424090482258,
    "right": 1424090482210
};

describe('Cell', function () {

    beforeEach(function () {
        map = new GameState();
        map.fetchServerGameMap(mockMap);
        cell = Cell.getNew();
    });

    it('creates', function () {
        expect(cell instanceof Cell).to.be.true;
    });

    it('fetchCell', function() {
        cell.fetchServerCell(serverCell, 0, 0, map);

        expect(cell.id).to.equal(mockMap.cells[0][0].id);
        expect(cell.x).to.equal(0);
        expect(cell.y).to.equal(0);
        expect(cell.occupantId).to.equal(1441909743098);

        expect(cell.walls.top).to.be.true;
        expect(cell.walls.bottom).to.be.false;
        expect(cell.walls.left).to.be.true;
        expect(cell.walls.right).to.be.false;
        expect(cell.ways.top).to.be.false;
        expect(cell.ways.bottom).to.be.true;
        expect(cell.ways.left).to.be.false;
        expect(cell.ways.right).to.be.true;
    });

});