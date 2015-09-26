function Cell() {

}

Cell.getNew = function() {
    return new Cell();
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
        var adjCell;

        if(cell.left) {
            adjCell = map.getCell(x-1, y);
            adjacents.push(adjCell)
        }
        if(cell.top) {
            adjCell = map.getCell(x, y-1);
            adjacents.push(adjCell)
        }
        if(cell.bottom) {
            adjCell = map.getCell(x, y+1);
            adjacents.push(adjCell)
        }
        if(cell.right) {
            adjCell = map.getCell(x+1, y);
            adjacents.push(adjCell)
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
    this.items = serverCell.items || [];
};

module.exports = Cell;