function Map(gameMap) {
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

};

module.exports = Map;
