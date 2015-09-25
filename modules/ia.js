var Maze = require('./maze');

function IA(gameController) {
    this.game = gameController;
    this.map = this.game.map;
}

IA.prototype.getActions = function(callback) {

    var maze = new Maze(this.map);

    var actions = [];
    var me = this.game.getMe();
    var ennemy = this.game.getMe();
    var sheep = this.game.getSheep();

    var source = this.map.getCell(me.position.x, me.position.y);
    var destination = this.map.getCell(sheep.position.x, sheep.position.y);

    maze.setSource(source);
    maze.breadthFirst(destination);

    if(maze.shortPath) {
        for(var i=0; i<me.pm; i++) {
            var cell = maze.shortPath[i];
            var action = {};

            //actions.push(action);
        }
    }

    setTimeout(function() {

        callback(actions);
    }, 100);
};

module.exports = IA;
