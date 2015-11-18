var Maze = require('./maze');
var Simulator = require('./simulator');
var Action = require('./action');
var Player = require('./player');

function IAEnnemy(gamestate, emulate) {
    this.gamestate = gamestate;
    this.emulate = emulate ? true : false;
}

IAEnnemy.prototype.setGameState = function(gamestate) {
    this.gamestate = gamestate;
};

IAEnnemy.prototype.getActions = function(callback) {

    var maze = new Maze(this.gamestate);

    var actions = [];

    var me = this.gamestate.players.getMe();
    if(this.emulate) {
        me = this.gamestate.players.getEnnemy();
    }

    var sheep = this.gamestate.players.getSheep();

    var source = this.gamestate.getCellById(me.cellId);
    var destination = this.gamestate.getCellById(sheep.cellId);

    maze.computeWeights(source);
    var route = maze.getShortestRoute(destination);

    if(route) {
        for(var i=0; i<route.cellPath.length; i++) {
            if(i === me.pm) break;

            var cell = route.cellPath[i];

            // si il y a un joueur, on ne va pas sur la case et on arrete de se deplacer
            if(cell.occupantId !== null && cell.occupantId !== sheep.id) {
                break;
            }

            var action = new Action();
            action.move(cell.id);

            actions.push(action);
        }
    }

    callback(actions);
};

module.exports = IAEnnemy;
