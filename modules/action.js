var _ = require('lodash');

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
    this.type = 'userItem';
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

Action.prototype.executeOnMap = function(map, player) {

    switch(this.type) {
        case 'move':
            executeMove(this.value, map, player);
            break;
    }
};

var executeMove = function(target, map, player) {
    var fromCell = map.getCell(player.position.x, player.position.y);
    var destCell = map.getCellById(target);

    if(player.id !== fromCell.occupantId) {
        console.log('wrong move execution, player is not here');
        return;
    }
    if(destCell.occupantId !== null) {
        console.log('wrong move execution, cell is occuped');
        return;
    }

    var adjacent = _.find(fromCell.adjacents, destCell);
    if(!adjacent) {
        console.log('wrong move execution, cells are not adjacents');
        return;
    }

    fromCell.occupantId = null;
    destCell.occupantId = player.id;
};

module.exports = Action;