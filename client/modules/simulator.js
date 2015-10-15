var _ = require('lodash');
var Action = require('./action');
var GameState = require('./gamestate');
var IApoulet = require('./iapoulet');

function Simulator(gamestate, iapoulet) {
    this.gamestate = gamestate.clone();

    // TODO pourquoi je l'avais sorti ?
    // Si il est sorti, le gamestate du poulet n'est pas la copie créée ici
    // Mais si il est ici ...
    this.iapoulet = new IApoulet(this.gamestate);
}

Simulator.prototype.simulateNTurns = function(n, callback) {

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