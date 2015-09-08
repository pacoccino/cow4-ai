var AI = function(communication) {
    this.communication = communication;
};

AI.prototype.listenGame = function(data) {
    if(data.type && data.type === 'getTurnOrder') {
        var gameMap = data.data;
        console.log("gameMap : ", gameMap);
    }
};

AI.prototype.listen = function() {
    this.communication.setListener(this.listenGame);
};


module.exports = AI;