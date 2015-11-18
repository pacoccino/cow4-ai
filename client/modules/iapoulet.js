var Maze = require('./maze');
var Route = require('./route');
var Action = require('./action');
var Cell = require('./cell');

var firstMoveSequence = null;

function IApoulet(gamestate) {
    this.gamestate = gamestate;

    this.lastIntersection = null;
    this.nextIntersection = null;
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

    var me = this.gamestate.players.getMe();
    var ennemy = this.gamestate.players.getEnnemy();
    var sheep = this.gamestate.players.getSheep();

    var myCell = this.gamestate.getCellById(me.cellId);
    var ennemyCell = this.gamestate.getCellById(ennemy.cellId);
    var sheepCell = this.gamestate.getCellById(sheep.cellId);

    var nextCellId = null;

    var maze = new Maze(this.gamestate);

    // Les x premiers tours sont pr�determin�s
    if(this.gamestate.currentTurn < firstMoveSequence.length) {
        nextCellId = firstMoveSequence[this.gamestate.currentTurn];
    }
    else {
        // On continue de fuir sur le chemin pr�vu
        if(sheepCell.adjacentsIds.length == 2) {

            maze.computeWeights(sheepCell);
            var routeToLastChoice = maze.getShortestRoute(this.lastIntersection);

            // On va dans le sens contraire de la derniere fois ou on a choisi une route
            if(sheepCell.adjacentsIds[0] !== routeToLastChoice.cellPath[0].id) {
                nextCellId = sheepCell.adjacentsIds[0];
            }
            else {
                nextCellId = sheepCell.adjacentsIds[1];
            }
        }
        // ben mon gars tu vas la ou tu peux !
        else if(sheepCell.adjacentsIds.length === 1) {
            nextCellId = sheepCell.adjacentsIds[0];
        }
        // On trouve un nouveau chemin
        else {

            this.lastIntersection = sheepCell;

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
                    nextCellId = adjacentId;
                    break;
                }
            }
            if(!nextCellId && adjacentsIds[0] !== undefined) {
                nextCellId = adjacentsIds[0];
            }
            var nextCell = this.gamestate.getCellById(nextCellId);

            this.nextIntersection = this.getNextIntersection(this.lastIntersection, nextCell);
        }
    }


    // Execution
    var actions = [];

    if(nextCellId) {
        var action = new Action();
        action.move(nextCellId);

        actions.push(action);
    }

    callback(actions);
};

IApoulet.prototype.getNextIntersection = function(fromCell, byCell) {
    var result = null;

    var adjacentsIds = byCell.adjacentsIds;
    if (adjacentsIds.length == 1 || adjacentsIds.length > 2) {
        result = byCell;
    } else {
        var nextCell = this.gamestate.getCellById(adjacentsIds[0]);
        if (nextCell.id == fromCell.id) {
            nextCell =this.gamestate.getCellById(adjacentsIds[1]);
        }
        result = this.getNextIntersection(byCell, nextCell);
    }
    return result;
};

module.exports = IApoulet;
