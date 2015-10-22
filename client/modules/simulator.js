var _ = require('lodash');
var Action = require('./action');
var GameState = require('./gamestate');

function Simulator(gamestate, iapoulet, iaennemy) {
    this.gamestate = gamestate.clone();

    this.iapoulet = iapoulet;
    this.iaennemy = iaennemy;
}

Simulator.prototype.simulateNTurns = function(n, callback) {

    this.iapoulet.setGameState(this.gamestate);
    this.iaennemy.setGameState(this.gamestate);

    var self = this;
    var ennemy = this.gamestate.players.getEnnemy();
    var poulet = this.gamestate.players.getSheep();

    var runTurn = function(turn) {
        if(turn < n) {

            self.iaennemy.getActions(function(actions) {
                Action.executeOnGamestate(actions, self.gamestate, ennemy);

                self.iapoulet.getActions(function(actions) {
                    Action.executeOnGamestate(actions, self.gamestate, poulet);

                    turn++;
                    self.gamestate.currentTurn++;
                    runTurn(turn);
                });
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