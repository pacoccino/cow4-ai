var Maze = require('./maze');
var Action = require('./action');

var sendDelay = 10;

function IA(gameController) {
    this.game = gameController;
    this.map = this.game.map;
}

IA.prototype.getActions = function(callback) {

    var maze = new Maze(this.map);

    var actions = [];
    var me = this.game.getMe();
    var ennemy = this.game.getEnnemy();
    var sheep = this.game.getSheep();

    var source = this.map.getCell(me.position.x, me.position.y);
    var destination = this.map.getCell(sheep.position.x, sheep.position.y);

    maze.setSource(source);
    maze.breadthFirst(destination);

    if(maze.shortPath) {
        for(var i=0; i<me.pm; i++) {
            var cell = maze.shortPath[i+1];

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
