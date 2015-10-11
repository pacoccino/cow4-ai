var GameState = require('./gamestate');
var Communication = require('./communication');
var IA = require('./ia');
var _ = require('lodash');

var GameController = function(communication) {
    this.communication = communication;

    this.gamestate = new GameState(this);

    this.ia = new IA(this.gamestate);

    this.currentTurn = 0;

    this.benchMark = [];
};


GameController.prototype.processIa = function(callback) {

    this.ia.getActions(function(actions) {
        callback(actions);
    });
};

GameController.prototype.getTurnOrder = function(gameMap, callback) {

    var self = this;

    self.gamestate.fetchServerGameMap(gameMap);

    console.log('New turn : ', self.gamestate.currentTurn);

    var bench = Date.now();

    self.processIa(function(actions) {

        var IAinfo = self.gamestate.players.getMe().toPublic();

        var response = {
            type: 'turnResult',
            ia: IAinfo,
            actions: actions
        };

        var time = Date.now() - bench;
        self.benchMark.push(time);
        var avg = _.round(_.sum(self.benchMark)/self.benchMark.length);

        console.log('Turn computed, took', time, "ms, average " + avg + "ms.");
        callback(response);
    });
};

GameController.prototype.listenGame = function(data) {

    var self = this;
    if(data.type && data.type === 'getTurnOrder') {

        self.getTurnOrder(data.data, function(turnOrder) {
            self.communication.send(turnOrder);
        });
    }
    else {
        console.log("Message recu inconnu:", data)
    }
};

GameController.prototype.listen = function() {
    this.communication.setListener(this.listenGame, this);
};

module.exports = GameController;
