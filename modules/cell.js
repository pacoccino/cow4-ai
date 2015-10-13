var _ = require('lodash');

function Cell() {
    this.id = null;
    this.ways = {};
    this.walls = {};
    this.adjacents = [];
    this.x = 0;
    this.y = 0;
    this.occupantId = null;
    this.isSheep = false;
    this.item = null;
}

Cell.getNew = function() {
    return new Cell();
};

Cell.prototype.clone = function() {
    var newCell = new Cell();

    newCell.id = this.id;
    newCell.ways = _.clone(this.ways);
    newCell.walls = _.clone(this.walls);
    newCell.adjacents = _.clone(this.adjacents);
    newCell.x = this.x;
    newCell.y = this.y;
    newCell.occupantId = this.occupantId;
    newCell.isSheep = this.isSheep;
    newCell.item = this.item;

    return newCell;
};

Cell.prototype.fetchServerCell = function (serverCell, x, y, map) {

    var findWays = function(cell) {
        return {
            left: cell.left ? true : false,
            top: cell.top ? true : false,
            bottom: cell.bottom ? true : false,
            right: cell.right ? true : false
        };
    };

    var findWalls = function(cell) {
        return {
            left: cell.left ? false : true,
            top: cell.top ? false : true,
            bottom: cell.bottom ? false : true,
            right: cell.right ? false : true
        };
    };

    var findAdjacents = function(cell) {
        var adjacents = [];

        if(cell.left) {
            adjacents.push(map.getCell(x-1, y));
        }
        if(cell.top) {
            adjacents.push(map.getCell(x, y-1));
        }
        if(cell.bottom) {
            adjacents.push(map.getCell(x, y+1));
        }
        if(cell.right) {
            adjacents.push(map.getCell(x+1, y));
        }
        return adjacents;
    };

    this.id = serverCell.id;
    this.ways = findWays(serverCell);
    this.walls = findWalls(serverCell);
    this.adjacents = findAdjacents(serverCell);
    this.x = x;
    this.y = y;
    this.occupantId = serverCell.occupant ? serverCell.occupant.id : null;
    this.isSheep = (serverCell.occupant && serverCell.occupant.name === 'SheepIA') ? true : false;
    this.item = serverCell.item || null;
};

module.exports = Cell;