function IA(gameController) {
    this.game = gameController;
}

IA.prototype.getActions = function(callback) {

    callback([]);
};

module.exports = IA;
