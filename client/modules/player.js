function Player(basePlayer) {

    basePlayer = basePlayer || {};

    this.setFrom(basePlayer);
}

Player.prototype.setFrom = function (basePlayer) {

    basePlayer = basePlayer || {};

    this.id = basePlayer.id || this.id || 0;
    this.name = basePlayer.name || this.name || 0;
    this.avatar = basePlayer.avatar || this.avatar || 0;

    this.items = basePlayer.items || this.items || [];
    this.pm = basePlayer.pm || this.pm || 0;
    this.invisibilityDuration = basePlayer.invisibilityDuration || this.invisibilityDuration || 0;

    this.cellId = basePlayer.cellId || this.cellId || 0;
};

Player.prototype.toPublic = function () {
    var publicPlayer = {
        id: this.id,
        avatar: this.avatar,
        name: this.name,
        pm: this.pm,
        items: this.items
    };
    return publicPlayer;
};

Player.prototype.clone = function () {
    var newPlayer = new Player(this);

    this.items = this.items.slice();

    return newPlayer;
};

module.exports = Player;
