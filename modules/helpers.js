var Helpers = {};

Helpers.CreateMatrix = function(width, height, populate) {
    if(!width) return [[]];

    height = height || width;

    var matrix = [];

    var getCell = function() {
        var cell = null;

        if(populate) {
            cell = {};
        }
        return cell;
    };

    for (var y=0; y<height; y++) {
        matrix.push([]);
        for (var x=0; x<width; x++) {
            matrix[y].push(getCell());
        }
    }

    return matrix;
};

module.exports = Helpers;