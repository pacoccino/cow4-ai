function Map() {
    this.gameMap = null;
}

Map.prototype.setMap = function(gameMap) {
    this.gameMap = gameMap;

    this.processMap();
}

Map.prototype.processMap = function() {

};

module.exports = Map;
