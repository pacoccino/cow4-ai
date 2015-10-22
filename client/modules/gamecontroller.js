var GameState = require('./gamestate');
var Action = require('./action');
var Config = require('./config');
var _ = require('lodash');

var GameController = function(communication) {
    this.communication = communication;

    this.gamestate = new GameState();

    this.ia = new Config.IA(this.gamestate);

    this.benchMark = [];
};


GameController.prototype.processIa = function(callback) {
    var self = this;

    self.ia.getActions(function(actions) {
        callback(actions);
    });
};

GameController.prototype.getTurnOrder = function(gameMap, callback) {


    this.gamestate.fetchServerGameMap(gameMap);

    console.log('New turn : ', this.gamestate.currentTurn);
    var casepoulet = this.gamestate.getCellById(this.gamestate.players.getSheep().cellId);
    var caseennemy = this.gamestate.getCellById(this.gamestate.players.getEnnemy().cellId);
    console.log('poulet :', casepoulet.x, casepoulet.y);
    console.log('enemmy :', caseennemy.x, caseennemy.y);

    var bench = Date.now();

    this.processIa(function(actions) {

        var IAinfo = this.gamestate.players.getMe().toPublic();

        var response = {
            type: 'turnResult',
            ia: IAinfo,
            actions: Action.transformForServer(actions)
        };

        var time = Date.now() - bench;
        this.benchMark.push(time);
        var avg = _.round(_.sum(this.benchMark)/this.benchMark.length);

        console.log('Turn computed, took', time, "ms, average " + avg + "ms.");
        callback(response);
    }.bind(this));
};

GameController.prototype.listenGame = function(servRes) {

    if(servRes.type && servRes.type === 'getTurnOrder') {

        this.getTurnOrder(servRes.data, function(turnOrder) {
            this.communication.send(turnOrder);
        }.bind(this));

        this.runTimeout();
    }
    else {
        console.log("Message recu inconnu:", servRes)
    }
};

GameController.prototype.listen = function() {
    this.communication.setListener( this.listenGame.bind(this) );
};

var disconnect = function() {
    process.exit(-1);
};

GameController.prototype.runTimeout = function(data) {

    if(this.serverTimeout) {
        clearTimeout(this.serverTimeout);
    }
    this.serverTimeout = setTimeout(disconnect, 5000);
};

module.exports = GameController;
