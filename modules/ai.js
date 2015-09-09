var Config = require('./map');

var AI = function(communication) {
    this.communication = communication;

    this.pm = 0;
    this.items = [];

    this.map = new Map();
};

AI.prototype.getIAInfo = function() {
    return {
        avatar: Config.avatar,
        name: Config.name,
        id: communication.getId(),
        pm: this.pm,
        items: this.items
    };
};

AI.prototype.processIa = function(callback) {
    var actions = [];

    callback(actions);
}

AI.prototype.getTurnOrder = function(gameMap, callback) {

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

AI.prototype.listenGame = function(data) {

    if(data.type && data.type === 'getTurnOrder') {

        this.getTurnOrder(data.data, function(turnOrder) {
            this.communication.send(turnOrder);
        });
    }
};

AI.prototype.listen = function() {
    this.communication.setListener(this.listenGame);
};


module.exports = AI;
