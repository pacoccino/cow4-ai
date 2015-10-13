var Constants = require('./constants');
var Player = require('./player');
var Communication = require('./communication');
var _ = require('lodash');

function Players(gamestate) {
    this.players = [];

    this.gamestate = gamestate;

    this._p = {}; // just for speed
}


Players.prototype.push = function(player) {
    this.players.push(player);
};

Players.prototype.getPlayerCell = function(player) {

    if(!(player instanceof Player)) {
        player = this.getPlayerById(player);
    }

    if(player) {
        var fetchedCell = this.gamestate.getCell(player.position.x, player.position.y);
        return fetchedCell;
    }
    else {
        return null;
    }
};

Players.prototype.getPlayerById = function(id) {
    return _.find(this.players, {id:id});
};

Players.prototype.getMe = function() {
    if(!this._p.me) {
        this._p.me = _.find(this.players, {id: Communication.MyId});
    }
    return this._p.me;
};

Players.prototype.getEnnemy = function() {
    if(!this._p.ennemy) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.id !== Communication.MyId && player.name !== Constants.SheepName) {
                this._p.ennemy = player;
            }
        }
    }
    return this._p.ennemy;
};

Players.prototype.getSheep = function() {
    if(!this._p.sheep) {
        this._p.sheep =  _.find(this.players, {name: Constants.SheepName});
    }
    return this._p.sheep;
};

module.exports = Players;

