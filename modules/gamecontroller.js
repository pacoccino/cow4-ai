var Constants = require('./constants');
var Map = require('./map');
var IA = require('./ia');
var _ = require('lodash');

var GameController = function(communication) {
    this.communication = communication;

    this.players = [];
    this.map = new Map(this);
    this.ia = new IA(this);

    this.currentTurn = 0;

    this.benchMark = [];

    this._p = {};
};

GameController.prototype.getPlayerById = function(id) {
    return _.find(this.players, {id:id});
};

GameController.prototype.getMe = function() {
    if(!this._p.me) {
        this._p.me = _.find(this.players, {id:this.communication.getId()});
    }
    return this._p.me;
};

GameController.prototype.getEnnemy = function() {
    if(!this._p.ennemy) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.id !== this.communication.getId() && player.name !== Constants.SheepName) {
                this._p.ennemy = player;
            }
        }
    }
    return this._p.ennemy;
};

GameController.prototype.getSheep = function() {
    if(!this._p.sheep) {
        this._p.sheep =  _.find(this.players, {name: 'SheepIA'});
    }
    return this._p.sheep;
};

GameController.prototype.processIa = function(callback) {

    this.ia.getActions(function(actions) {
        callback(actions);
    });
};

GameController.prototype.getTurnOrder = function(gameMap, callback) {

    var self = this;

    self.map.setGameMap(gameMap);
    this.currentTurn = gameMap.currentTurn;

    console.log('New turn : ', self.currentTurn);
    var bench = Date.now();

    self.processIa(function(actions) {

        var IAinfo = self.getPlayerById(self.communication.getId()).toPublic();

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
