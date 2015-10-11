var Player = require('./player');
var Cell = require('./cell');
var Helpers = require('./helpers');
var _ = require('lodash');

function Map(game, serverGameMap) {
    this.game = game;

    this.serverGameMap = null;

    this.fetchedMap = [];

    if(serverGameMap) {
        this.setGameMap(serverGameMap);
    }
}

Map.prototype.setGameMap = function(serverGameMap) {
    this.serverGameMap = serverGameMap;

    this.mapSize = {
        height: this.serverGameMap.cells.length,
        width: this.serverGameMap.cells[0].length
    };

    this.fetchedMap = Helpers.CreateMatrix(this.mapSize.width, this.mapSize.height, Cell.getNew);

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

    for (var y = 0; y < this.mapSize.height; y++) {
        for (var x = 0; x < this.mapSize.height; x++) {
            var serverCell = this.serverGameMap.cells[y][x];
            var myCell = this.getCell(x,y);

            myCell.fetchServerCell(serverCell, x, y, this);
            this.locatePlayer(serverCell, x, y);
        }
    }
};


Map.prototype.fetchPlayers = function() {

    for (var i = 0; i < this.serverGameMap.iaList.length; i++) {
        var player = this.serverGameMap.iaList[i];

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

