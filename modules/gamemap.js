var GameMap = function(gameMap) {
    this.map = null;
    if(gameMap) {
        this.setMap(gameMap);
    }
};

GameMap.prototype.setMap = function(gameMap) {
    this.map = gameMap;
};