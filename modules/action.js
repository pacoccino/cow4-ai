function Action() {
    this.type = null;
    this.value = null;
}

Action.prototype.move = function(cellId) {
    this.type = 'move';
    this.value = cellId;
};

Action.prototype.getItem = function() {
    this.type = 'getItem';
};
Action.prototype.useItem = function(itemType) {
    this.type = 'useItem';
    this.value = itemType;
};

Action.prototype.getServerAction = function() {

    var serverAction = {};
    switch(this.type) {
        case 'move':
            serverAction.type = 'move';
            serverAction.target = this.value;
            break;
        case 'getItem':
            serverAction.type = 'getItem';
            break;
        case 'useItem':
            serverAction.type = 'useItem';
            serverAction.item = {
                type: this.value
            };
            break;
    }

    return serverAction;
};

module.exports = Action;