var Route = function(source, destination) {
    this.path = [];
    this.cellPath = [];

    this.items = [];

    this.length = 0;

    this.source = source;
    this.destination = destination;
};

Route.prototype.addStep = function(cell) {
    this.path.push({
        x: cell.x,
        y: cell.y
    });

    this.cellPath.push(cell);

    this.length++;

    this.items.push(cell.item);
};

Route.prototype.reverse = function() {
    this.path.reverse();
    this.cellPath.reverse();
};

Route.prototype.clone = function() {
    var newRoute = new Route(this.source, this.destination);

    newRoute.path = this.path.slice();
    newRoute.cellPath = this.cellPath.slice();
    newRoute.items = this.items.slice();
    newRoute.containsTrap = this.containsTrap;
    newRoute.length = this.length;

    return newRoute;
};

Route.prototype.getPublic = function() {
    return {
        path: this.path,
        length: this.length,
        items: this.items,
        containsTrap: this.containsTrap
    }
};

module.exports = Route;