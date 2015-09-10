function Map(game, gameMap) {
    this.game = game;

    this.gameMap = null;

    if(gameMap) {
        this.setMap(gameMap);
    }
}

Map.prototype.setMap = function(gameMap) {
    this.gameMap = gameMap;

    this.processMap();
}

Map.prototype.processMap = function() {
    console.log(this.gameMap);
};

module.exports = Map;
