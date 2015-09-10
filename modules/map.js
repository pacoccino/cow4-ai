var Player = require('./player');

function Map(game, gameMap) {
    this.game = game;

    this.gameMap = null;

    this.currentTurn = 0;
    this.iaList = [];
    this.cells = [];

    if(gameMap) {
        this.setMap(gameMap);
    }
}

Map.prototype.setMap = function(gameMap) {
    this.gameMap = gameMap;

    this.currentTurn = this.gameMap.currentTurn;
    this.iaList = this.gameMap.iaList;
    this.cells = this.gameMap.cells;

    this.mapSize = {
        height: this.cells.length,
        width: this.cells[0].length
    }
};


Map.prototype.processMap = function() {

    /*
     var fs = require('fs');
     fs.writeFile("map.json", JSON.stringify(gameMap), function(err) {
     if(err) {
     return console.log(err);
     }

     console.log("The file was saved!");
     });*/

    if(this.game.players.length !== 3) {
        this.fetchPlayers();
    }

    this.localteNFetch();
    //this.drawCells();
};

Map.prototype.getFetchedCell = function(x,y) {
    return this.fetchedMap[x + y * this.mapSize.width];
};

Map.prototype.forEachCell = function(fn) {
    for (var y = 0; y < this.mapSize.height; y++) {
        for (var x = 0; x < this.mapSize.height; x++) {
            fn(this.cells[y][x], x, y);
        }
    }
};

Map.prototype.fetchPlayers = function() {

    for (var i = 0; i < this.iaList.length; i++) {
        var player = this.iaList[i];

        var existing = this.game.getPlayerById(player.id);
        if(!existing) {
            var newPlayer = new Player(player);
            this.game.players.push(newPlayer);
        }
        else {
            existing.setFrom(player);
        }
    }
};

Map.prototype.locatePlayer = function(cell, x, y) {

    if (cell.occupant) {
        var existing = this.game.getPlayerById(cell.occupant.id);

        if (!existing) {
            console.error("Unknown player on the map !");
        }
        else {
            existing.position = {
                id: cell.id,
                x: x,
                y: y
            };
        }
    }
};

Map.prototype.locatePlayers = function() {

    var self = this;

    self.forEachCell(function(cell, x, y) {
        self.locatePlayer.apply(self, [cell, x, y]);
    });

};

Map.prototype.fetchCell = function(cell, x, y) {
    var findWays = function(cell) {
        var ways = {
            left: cell.left ? true : false,
            top: cell.top ? true : false,
            bottom: cell.bottom ? true : false,
            right: cell.right ? true : false
        };
        return ways;
    };
    var findWalls = function(cell) {
        var walls = {
            left: cell.left ? false : true,
            top: cell.top ? false : true,
            bottom: cell.bottom ? false : true,
            right: cell.right ? false : true
        };
        return walls;
    };

    var myCell = {};
    myCell.id = cell.id;
    myCell.ways = findWays(cell);
    myCell.walls = findWalls(cell);
    myCell.x = x;
    myCell.y = y;
    myCell.occupantId = cell.occupant ? cell.occupant.id : null;
    myCell.isSheep = (cell.occupant && cell.occupant.name === "SheepIA") ? true : false;
    myCell.items = cell.items || [];

    return myCell;
};

Map.prototype.fetchCells = function() {
    var matrix = [];

    var self = this;

    self.forEachCell(function(cell, x, y) {

        var myCell = self.fetchCell.apply(self, [cell, x, y]);

        matrix.push(myCell);
    });

    this.fetchedMap = matrix;
};

Map.prototype.localteNFetch = function() {
    var matrix = [];

    var self = this;

    self.forEachCell(function(cell, x, y) {

        var myCell = self.fetchCell.apply(self, [cell, x, y]);
        matrix.push(myCell);

        self.locatePlayer.apply(self, [cell, x, y]);
    });

    this.fetchedMap = matrix;
};

Map.prototype.drawCells = function() {

    if (!this.fetchedMap || this.fetchedMap.length < 1) {
        console.log("nothing to draw");
    }

    for (var y = 0; y < this.mapSize.height; y++) {
        for (var z = 0; z < 2; z++) {
            for (var x = 0; x < this.mapSize.width; x++) {
                var cell = this.getFetchedCell(x, y);
                if (z === 0) {
                    if (cell.walls.top)
                        process.stdout.write(" -");
                    else
                        process.stdout.write("  ");
                }
                else if (z === 1) {
                    if (cell.walls.left)
                        process.stdout.write("|");
                    else
                        process.stdout.write(" ");

                    if (cell.occupantId) {
                        if (cell.isSheep)
                            process.stdout.write("S");
                        else
                            process.stdout.write("P");
                    }
                    else
                        process.stdout.write(" ");

                }
            }

            var cell = this.getFetchedCell(this.mapSize.width-1, y);
            if (z === 1 && cell.walls.right) {
                process.stdout.write("|");
            }
            process.stdout.write("\n");
        }
    }
    for (var x = 0; x < this.mapSize.width; x++) {
        var cell = this.getFetchedCell(x, this.mapSize.height-1);
        if (cell.walls.bottom)
            process.stdout.write(" -");
        else
            process.stdout.write("  ");
    }

    process.stdout.write("\n");

};

module.exports = Map;

