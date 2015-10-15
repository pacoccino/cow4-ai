var _ = require('lodash');
var Action = require('./action');
var GameState = require('./gamestate');

function Simulator(gamestate, iapoulet) {
    this.gamestate = gamestate.clone();

    this.iapoulet = iapoulet;
}

Simulator.prototype.simulateNTurns = function(n, callback) {

    this.iapoulet.setGameState(this.gamestate);

    var self = this;
    var poulet = this.gamestate.players.getSheep();

    var runTurn = function(turn) {
        if(turn < n) {

            self.iapoulet.getActions(function(actions) {
                Action.executeOnGamestate(actions, self.gamestate, poulet);
                turn++;
                self.gamestate.currentTurn++;
                runTurn(turn);
            });
        }
        else {
            callback(self.gamestate);
        }
    };

    if(n > 0)
        runTurn(0);
    else
        callback(self.gamestate);
};

module.exports = Simulator;