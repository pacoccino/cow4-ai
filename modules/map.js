var Player = require('./player');
var Helpers = require('./helpers');
var _ = require('lodash');

function Map(game, gameMap) {
    this.game = game;

    this.gameMap = null;

    this.fetchedMap = [];

    if(gameMap) {
        this.setGameMap(gameMap);
    }
}

Map.prototype.setGameMap = function(gameMap) {
    this.gameMap = gameMap;

    this.mapSize = {
        height: this.gameMap.cells.length,
        width: this.gameMap.cells[0].length
    };

    this.fetchedMap = Helpers.CreateMatrix(this.mapSize.width, this.mapSize.height, true);

    this.processGameMap();
};

Map.prototype.getMap = function() {
    return this.fetchedMap;
};

Map.prototype.getCell = function(x,y) {

    return this.fetchedMap[y][x];
};

Map.prototype.getCellById = function(cellId) {

    var map = this.getMap();

    for (var y = 0; y < map.length; y++) {
        var row = map[y];

        var cell = _.find(row, {id:cellId});
        if(cell) {
            return cell;
        }
    }

    return null;
};

Map.prototype.getPlayerCell = function(playerId) {

    var player = this.game.getPlayerById(playerId);
    if(player) {
        var fetchedCell = this.getCell(player.position.x, player.position.y);
        return fetchedCell;
    }
    else {
        return null;
    }
};

Map.prototype.getSerializableMap = function() {
    var serializable = _.cloneDeep(this.fetchedMap);

    for (var y=0; y<this.mapSize.height; y++) {
        for (var x=0; x<this.mapSize.width; x++) {
            delete serializable[y][x].adjacents;
        }
    }
    return serializable;
};

Map.prototype.processGameMap = function() {

    this.fetchPlayers();

    var self = this;

    self.forEachCell(function(cell, x, y) {

        var myCell = self.getCell.apply(self, [x,y]);

        self.fetchCell.apply(self, [cell, x, y, myCell]);
        self.locatePlayer.apply(self, [cell, x, y]);
    });
};

Map.prototype.forEachCell = function(fn) {
    for (var y = 0; y < this.mapSize.height; y++) {
        for (var x = 0; x < this.mapSize.height; x++) {
            fn(this.gameMap.cells[y][x], x, y);
        }
    }
};

Map.prototype.fetchPlayers = function() {

    for (var i = 0; i < this.gameMap.iaList.length; i++) {
        var player = this.gameMap.iaList[i];

        var existing = this.game.getPlayerById(player.id);
        if(!existing) {
            var newPlayer = new Player(player);
            this.game.players.push(newPlayer);
        }
        else {
            existing.setFrom(player);
        }
    }
};

Map.prototype.locatePlayer = function(cell, x, y) {

    if (cell.occupant) {
        var existing = this.game.getPlayerById(cell.occupant.id);

        if (!existing) {
            console.error('Unknown player on the map !');
        }
        else {
            existing.position = {
                id: cell.id,
                x: x,
                y: y
            };
        }
    }
};

Map.prototype.fetchCell = function(cell, x, y, newCell) {
    var self = this;

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
            adjCell = self.getCell(x-1, y);
            adjacents.push(adjCell)
        }
        if(cell.top) {
            adjCell = self.getCell(x, y-1);
            adjacents.push(adjCell)
        }
        if(cell.bottom) {
            adjCell = self.getCell(x, y+1);
            adjacents.push(adjCell)
        }
        if(cell.right) {
            adjCell = self.getCell(x+1, y);
            adjacents.push(adjCell)
        }
        return adjacents;
    };

    var myCell = newCell;
    myCell.id = cell.id;
    myCell.ways = findWays(cell);
    myCell.walls = findWalls(cell);
    myCell.adjacents = findAdjacents(cell);
    myCell.x = x;
    myCell.y = y;
    myCell.occupantId = cell.occupant ? cell.occupant.id : null;
    myCell.isSheep = (cell.occupant && cell.occupant.name === 'SheepIA') ? true : false;
    myCell.items = cell.items || [];
};

Map.prototype.drawMap = function() {

    if (!this.fetchedMap || this.fetchedMap.length < 1) {
        console.log('nothing to draw');
    }

    process.stdout.write('\n');

    for (var y = 0; y < this.mapSize.height; y++) {
        for (var z = 0; z < 2; z++) {
            for (var x = 0; x < this.mapSize.width; x++) {
                var cell = this.getCell(x, y);
                if (z === 0) {
                    if (cell.walls.top)
                        process.stdout.write(' -');
                    else
                        process.stdout.write('  ');
                }
                else if (z === 1) {
                    if (cell.walls.left)
                        process.stdout.write('|');
                    else
                        process.stdout.write(' ');

                    if (cell.occupantId) {
                        if (cell.isSheep)
                            process.stdout.write('S');
                        else
                            process.stdout.write('P');
                    }
                    else
                        process.stdout.write(' ');

                }
            }

            var cell = this.getCell(this.mapSize.width-1, y);
            if (z === 1 && cell.walls.right) {
                process.stdout.write('|');
            }
            process.stdout.write('\n');
        }
    }
    for (var x = 0; x < this.mapSize.width; x++) {
        var cell = this.getCell(x, this.mapSize.height-1);
        if (cell.walls.bottom)
            process.stdout.write(' -');
        else
            process.stdout.write('  ');
    }

    process.stdout.write('\n');

};

module.exports = Map;

