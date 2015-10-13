var mockMap = require('./mockMap.json');
var Cell = require('../client/modules/cell');
var GameState = require('../client/modules/gamestate');
var GameController = require('../client/modules/gamecontroller');

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

    it('clones', function () {
        cell.id = 45;
        cell.ways = {top: 45, bottom: 12};
        cell.walls = {top: 855, bottom: 182};
        cell.adjacents = [cell.ways, cell.walls];
        cell.x = 2;
        cell.y = 3;
        cell.occupantId = 4;
        cell.isSheep = 5;
        cell.item = 6;

        var newCell = cell.clone();

        expect(newCell.id).to.equal(cell.id);
        expect(newCell.ways).not.to.equal(cell.ways);
        expect(newCell.walls).not.to.equal(cell.walls);
        expect(newCell.ways.top).to.equal(cell.ways.top);
        expect(newCell.ways.bottom).to.equal(cell.ways.bottom);
        expect(newCell.walls.top).to.equal(cell.walls.top);
        expect(newCell.walls.bottom).to.equal(cell.walls.bottom);

        expect(newCell.adjacents).not.to.equal(cell.adjacents);
        expect(newCell.adjacents.length).to.equal(cell.adjacents.length);
        expect(newCell.adjacents[0]).to.equal(cell.adjacents[0]);

        expect(newCell.x).to.equal(cell.x);
        expect(newCell.y).to.equal(cell.y);
        expect(newCell.occupantId).to.equal(cell.occupantId);
        expect(newCell.isSheep).to.equal(cell.isSheep);
        expect(newCell.item).to.equal(cell.item);
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