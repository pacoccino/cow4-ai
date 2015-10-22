var _ = require('lodash');

function Cell() {
    this.id = null;
    this.ways = {};
    this.walls = {};
    this.adjacentsIds = [];
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
    newCell.adjacentsIds = _.clone(this.adjacentsIds);
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
        var adjacentsIds = [];

        if(cell.top) {
            adjacentsIds.push(cell.top);
        }
        if(cell.bottom) {
            adjacentsIds.push(cell.bottom);
        }
        if(cell.left) {
            adjacentsIds.push(cell.left);
        }
        if(cell.right) {
            adjacentsIds.push(cell.right);
        }
        return adjacentsIds;
    };

    this.id = serverCell.id;
    this.ways = findWays(serverCell);
    this.walls = findWalls(serverCell);
    this.adjacentsIds = findAdjacents(serverCell);
    this.x = x;
    this.y = y;
    this.occupantId = serverCell.occupant ? serverCell.occupant.id : null;
    this.item = serverCell.item || null;
};

module.exports = Cell;