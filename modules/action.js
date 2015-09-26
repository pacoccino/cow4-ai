function Action() {
    this.type = null;
    this.value = null;
}

Action.prototype.move = function(cellId) {
    this.type = 'move';
    this.value = cellId;
};

Action.prototype.getItem = function() {

};
Action.prototype.getServerAction = function() {

    var serverAction = {};
    switch(this.type) {
        case 'move':
            serverAction.type = 'move';
            serverAction.target = this.value;
            break;
    }

    return serverAction;
};

module.exports = Action;