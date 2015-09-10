var Config = require('./map');

var GameController = function(communication) {
    this.communication = communication;

    this.players = [];
    this.map = new Map(this);
    this.ia = new IA(this);
};

GameController.prototype.getIAInfo = function() {
    return {
        avatar: Config.avatar,
        name: Config.name,
        id: communication.getId(),
        pm: players[communication.getId()].pm,
        items: players[communication.getId()].items
    };
};

GameController.prototype.processIa = function(callback) {

    this.ia.getActions(function(actions) {
        callback(actions);
    });
}

GameController.prototype.getTurnOrder = function(gameMap, callback) {

    console.log("gameMap : ", gameMap);

    this.map.setMap(gameMap);

    this.processIa(function(actions) {

        var response = {
            type: 'turnResult',
            ia: this.getIAInfo(),
            actions: actions
        };

        callback(response);
    };
};

GameController.prototype.listenGame = function(data) {

    if(data.type && data.type === 'getTurnOrder') {

        this.getTurnOrder(data.data, function(turnOrder) {
            this.communication.send(turnOrder);
        });
    }
};

GameController.prototype.listen = function() {
    this.communication.setListener(this.listenGame);
};


module.exports = GameController;
