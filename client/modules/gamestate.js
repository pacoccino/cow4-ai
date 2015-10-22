var _ = require('lodash');
var Player = require('./player');
var Players = require('./players');
var Cell = require('./cell');
var Logger = require('./logger');
var Helpers = require('./helpers');

function GameState() {
    this.serverGameMap = null;

    this.players = new Players(this);

    this.fetchedMap = [];
    this.mapSize = {
        height:0,
        width: 0
    };

    this.currentTurn = 0;
    this.allItems = [];

}


GameState.prototype.fetchServerGameMap = function(serverGameMap) {
    Logger.writeMap(serverGameMap);
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
        for (var x = 0; x < row.length; x++) {
            var cell = row[x];
            if( cell.id === cellId){
                return cell;
            }
        }
    }

    return null;
};

GameState.prototype.processGameMap = function() {

    this.fetchPlayers();

    this.allItems = [];

    for (var y = 0; y < this.mapSize.height; y++) {
        for (var x = 0; x < this.mapSize.height; x++) {
            var serverCell = this.serverGameMap.cells[y][x];
            var myCell = this.getCell(x,y);

            myCell.fetchServerCell(serverCell, x, y, this);
            this.concatItems(myCell);
            this.locatePlayer(serverCell);
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

GameState.prototype.locatePlayer = function(serverCell) {

    if (serverCell.occupant) {
        var existing = this.players.getPlayerById(serverCell.occupant.id);

        if (!existing) {
            console.error('Unknown player on the map !');
        }
        else {
            existing.cellId = serverCell.id;
        }
    }
};

GameState.prototype.concatItems = function(cell) {

    if(!cell.item) return;

    var item = _.clone(cell.item);
    item.cell = cell;
    this.allItems.push(item);
};


GameState.prototype.clone = function() {
    var newGameState = new GameState();
    newGameState.currentTurn = this.currentTurn;

    for (var i = 0; i < this.players.players.length; i++) {
        var player = this.players.players[i];
        newGameState.players.push(player.clone());
    }

    newGameState.fetchedMap = Helpers.CreateMatrix(this.mapSize.width, this.mapSize.height);
    for (var y = 0; y < newGameState.fetchedMap.length; y++) {
        for (var x = 0; x < newGameState.fetchedMap[y].length; x++) {
            newGameState.fetchedMap[y][x] = this.fetchedMap[y][x].clone();
        }
    }

    newGameState.allItems = this.allItems.slice();

    newGameState.mapSize = {
        height:this.mapSize.height,
        width: this.mapSize.width
    };

    return newGameState;
};

module.exports = GameState;

