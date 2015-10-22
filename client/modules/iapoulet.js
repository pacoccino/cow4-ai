var Maze = require('./maze');
var Route = require('./route');
var Action = require('./action');
var Cell = require('./cell');

var firstMoveSequence = null;

function IApoulet(gamestate) {
    this.gamestate = gamestate;
    this.players = this.gamestate.players;

}

IApoulet.prototype.setGameState = function(gamestate) {
    this.gamestate = gamestate;
};

IApoulet.prototype.generateMoveSequence = function() {
    firstMoveSequence = [];
    for (var i = 1; i < 13; i++) {
        var cell = this.gamestate.getCell(12 - i, 12);
        firstMoveSequence.push(cell.id);
    }
};

// TODO capable de se rappeller de la derniere position meme si on a fait un new a ce tour tour
IApoulet.prototype.getActions = function(callback) {

    if(!firstMoveSequence) this.generateMoveSequence();

    var me = this.players.getMe();
    var ennemy = this.players.getEnnemy();
    var sheep = this.players.getSheep();

    var myCell = this.gamestate.getCellById(me.cellId);
    var ennemyCell = this.gamestate.getCellById(ennemy.cellId);
    var sheepCell = this.gamestate.getCellById(sheep.cellId);

    var nextCell = null;

    // Les x premiers tours sont pr�determin�s
    if(this.gamestate.currentTurn < firstMoveSequence.length) {
        nextCell = firstMoveSequence[this.gamestate.currentTurn];
    }
    else {
        // On continue de fuir sur le chemin pr�vu
        if(sheepCell.adjacentsIds.length < 3) {
            if(sheepCell.adjacentsIds[0].id !== this.lastCell.id) {
                nextCell = sheepCell.adjacentsIds[0];
            }
            else {
                nextCell = sheepCell.adjacentsIds[1];
            }
        }
        // On trouve un nouveau chemin
        else {

            var maze = new Maze(this.gamestate);
            maze.computeWeights(sheepCell);

            var routeToMe = maze.getShortestRoute(myCell);
            var routeToEnnemy = maze.getShortestRoute(ennemyCell);

            var adjacentsIds = sheepCell.adjacentsIds;

            for (var i = 0; i < adjacentsIds.length; i++) {
                var adjacentId = adjacentsIds[i];
                if(adjacentId === routeToMe.cellPath[0].id || adjacentId === routeToEnnemy.cellPath[0].id) {
                    continue;
                }
                else {
                    nextCell = adjacentId;
                    break;
                }
            }
        }
    }

    this.lastCell = sheepCell;

    // Execution
    var actions = [];

    if(nextCell) {
        var action = new Action();
        action.move(nextCell);

        actions.push(action);
    }

    callback(actions);
};

module.exports = IApoulet;
