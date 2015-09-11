var Config = require('./config');
var Map = require('./map');
var Player = require('./player');
var IA = require('./ia');
var _ = require('lodash');

var GameController = function(communication) {
    this.communication = communication;

    this.players = [];
    this.map = new Map(this);
    this.ia = new IA(this);

    /*
    this.myPlayer = new Player();
    this.myPlayer.id = this.communication.getId();
    this.myPlayer.name = Config.name;
    this.myPlayer.avatar = Config.avatar;

    this.players.push(this.myPlayer);*/
};

GameController.prototype.getPlayerById = function(id) {
    return _.find(this.players, {id:id});
};

GameController.prototype.getSheep = function() {
    return _.find(this.players, {name:"SheepIA"});
};

GameController.prototype.processIa = function(callback) {

    this.ia.getActions(function(actions) {
        callback(actions);
    });
};

GameController.prototype.getTurnOrder = function(gameMap, callback) {

    var self = this;

    self.map.setGameMap(gameMap);
    self.map.processMap();

    console.log("New turn : ", self.map.currentTurn);

    self.processIa(function(actions) {

        var IAinfo = self.getPlayerById(self.communication.getId());

        var response = {
            type: 'turnResult',
            ia: IAinfo,
            actions: actions
        };

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
};

GameController.prototype.listen = function() {
    this.communication.setListener(this.listenGame, this);
};


module.exports = GameController;
