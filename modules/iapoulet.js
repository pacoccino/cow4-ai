var Maze = require('./maze');
var Route = require('./route');
var Action = require('./action');


var sendDelay = 1;

function IApoulet(gamestate) {
    this.gamestate = gamestate;
    this.players = this.gamestate.players;

    this.currentRoute = null;
    this.firstMove = true;
}

IApoulet.prototype.getActions = function(callback) {

    if(this.gamestate.currentTurn === 0) {
        callback([]);
        return;
    }

    var me = this.players.getMe();
    var ennemy = this.players.getEnnemy();
    var sheep = this.players.getSheep();

    var myCell = this.players.getPlayerCell(me);
    var ennemyCell = this.players.getPlayerCell(ennemy);
    var sheepCell = this.players.getPlayerCell(sheep);

    var nextCell = null;

    if(this.firstMove) {
        this.currentRoute = new Route();

        for (var i = 0; i < 12; i++) {
            var cell = this.gamestate.getCell(12-i-1, 12);
            this.currentRoute.addStep(cell);
        }
        nextCell = this.currentRoute.cellPath.shift();
        this.firstMove = false;
    }
    else {

        if(this.currentRoute && this.currentRoute.cellPath.length > 0) {
            nextCell = this.currentRoute.cellPath.shift();
        }
        else {
            this.currentRoute = null;

            // On continue de fuir sur le chemin prévu
            if(sheepCell.adjacents.length < 3) {
                // TODO pourquoi les references sont differentes ?
                if(sheepCell.adjacents[0].id !== this.lastCell.id) {
                    nextCell = sheepCell.adjacents[0];
                }
                else {
                    nextCell = sheepCell.adjacents[1];
                }
            }
            // On trouve un nouveau chemin
            else {
                this.currentRoute = null;

                var maze = new Maze(this.gamestate);
                maze.computeWeights(sheepCell);

                var routeToMe = maze.getShortestRoute(myCell);
                var routeToEnnemy = maze.getShortestRoute(ennemyCell);

                var adjacents = sheepCell.adjacents;

                for (var i = 0; i < adjacents.length; i++) {
                    var adjacent = adjacents[i];
                    if(adjacent === routeToMe.cellPath[0] || adjacent === routeToEnnemy.cellPath[0]) {
                        continue;
                    }
                    else {
                        nextCell = adjacent;
                        break;
                    }
                }

            }
        }
    }

    this.lastCell = sheepCell;
    // Execution
    var actions = [];

    if(nextCell) {
        var action = new Action();
        console.log("next", nextCell.x, nextCell.y);
        action.move(nextCell.id);

        actions.push(action.getServerAction());
    }

    setTimeout(function() {

        callback(actions);
    }, sendDelay);
};

module.exports = IApoulet;
