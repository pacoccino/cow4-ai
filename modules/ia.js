var Maze = require('./maze');
var Action = require('./action');

var sendDelay = 1;

function IA(gamestate) {
    this.gamestate = gamestate;
}

IA.prototype.getActions = function(callback) {

    var maze = new Maze(this.gamestate);

    var actions = [];
    var me = this.gamestate.players.getMe();
    var ennemy = this.gamestate.players.getEnnemy();
    var sheep = this.gamestate.players.getSheep();

    var source = this.gamestate.getCell(me.position.x, me.position.y);
    var destination = this.gamestate.getCell(sheep.position.x, sheep.position.y);

    maze.computeWeights(source);
    var route = maze.getShortestRoute(destination);

    if(route) {
        for(var i=0; i<me.pm; i++) {
            var cell = route.cellPath[i];

            // si il y a un joueur, on ne va pas sur la case et on arrete de se deplacer
            if(cell.occupantId !== null && cell.occupantId !== sheep.id) {
                break;
            }

            var action = new Action();
            action.move(cell.id);

            actions.push(action.getServerAction());
        }
    }

    setTimeout(function() {

        callback(actions);
    }, sendDelay);
};

module.exports = IA;
