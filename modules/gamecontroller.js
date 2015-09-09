var Config = require('./map');

var GameController = function(communication) {
    this.communication = communication;

    this.pm = 0;
    this.items = [];

    this.map = new Map();
};

GameController.prototype.getIGameControllernfo = function() {
    return {
        avatar: Config.avatar,
        name: Config.name,
        id: communication.getId(),
        pm: this.pm,
        items: this.items
    };
};

GameController.prototype.processIa = function(callback) {
    var actions = [];

    callback(actions);
}

GameController.prototype.getTurnOrder = function(gameMap, callback) {

    console.log("gameMap : ", gameMap);

    this.map.setMap(gameMap);

    this.processIa(function(actions) {

            var response = {
                type: 'turnResult',
                ia: this.getIGameControllernfo(),
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
