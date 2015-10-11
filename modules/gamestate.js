var Player = require('./player');
var Players = require('./players');
var Cell = require('./cell');
var Helpers = require('./helpers');
var _ = require('lodash');

function GameState() {
    this.serverGameMap = null;

    this.players = new Players(this);

    this.fetchedMap = [];

    this.currentTurn = 0;
    this.allItems = [];
}


GameState.prototype.fetchServerGameMap = function(serverGameMap) {
    this.serverGameMap = serverGameMap;

    this.currentTurn = serverGameMap.currentTurn;

    this.mapSize = {
        height: this.serverGameMap.cells.length,
        width: this.serverGameMap.cells[0].length
    };

    this.fetchedMap = Helpers.CreateMatrix(this.mapSize.width, this.mapSize.height, Cell.getNew);
    this.allItems = [];

    this.processGameMap();
};

GameState.prototype.getMap = function() {
    return this.fetchedMap;
};

GameState.prototype.getCell = function(x,y) {

    return this.fetchedMap[y][x];
};

GameState.prototype.getCellById = function(cellId) {

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

GameState.prototype.getSerializableMap = function() {
    var serializable = _.cloneDeep(this.fetchedMap);

    for (var y=0; y<this.mapSize.height; y++) {
        for (var x=0; x<this.mapSize.width; x++) {
            delete serializable[y][x].adjacents;
        }
    }
    return serializable;
};

GameState.prototype.processGameMap = function() {

    this.fetchPlayers();

    for (var y = 0; y < this.mapSize.height; y++) {
        for (var x = 0; x < this.mapSize.height; x++) {
            var serverCell = this.serverGameMap.cells[y][x];
            var myCell = this.getCell(x,y);

            myCell.fetchServerCell(serverCell, x, y, this);
            this.concatItems(myCell);
            this.locatePlayer(serverCell, x, y);
        }
    }
};


GameState.prototype.fetchPlayers = function() {

    for (var i = 0; i < this.serverGameMap.iaList.length; i++) {
        var player = this.serverGameMap.iaList[i];

        var existing = this.players.getPlayerById(player.id);
        if(!existing) {
            var newPlayer = new Player(player);
            this.players.push(newPlayer);
        }
        else {
            existing.setFrom(player);
        }
    }
};

GameState.prototype.locatePlayer = function(cell, x, y) {

    if (cell.occupant) {
        var existing = this.players.getPlayerById(cell.occupant.id);

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
GameState.prototype.concatItems = function(cell) {

    if(!cell.item) return;

    this.allItems.push(
        {
            cell: cell,
            item: cell.item
        }
    );
};

GameState.prototype.drawMap = function() {

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

module.exports = GameState;

