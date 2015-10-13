var _ = require('lodash');
var GameState = require('./gamestate');

function Simulator() {
    this.gamestate = new GameState();
}

Simulator.prototype.play = function() {
};

module.exports = Simulator;