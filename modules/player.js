function Player() {

    this.id = 0;   
    this.name = 0;
    this.avatar = 0;

    this.pm = 0;
    this.items = [];
};


Player.prototype.toPublic = function () {
    var publicPlayer = {
        id: this.id,
        avatar: this.avatar,
        name: this.name,
        pm: this.pm,
        items: this.items
    };
}

module.exports = Player;
