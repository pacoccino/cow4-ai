var fs = require('fs');
var beautify = require('js-beautify').js_beautify;

var Config = require('./config');

var Logger = {};

var path = 'logs/';
var path = 'logs/';

Logger.writeMap = function(map) {
    if(!Config.real) return;

    var turnId = map.currentTurn;
    if(turnId >= 0 && turnId < 10) turnId = "00" + turnId;
    else if(turnId >= 10 && turnId < 100) turnId = "0" + turnId;

    var filename = 'turn' + turnId + '.json';

    var text = beautify(JSON.stringify(map), { indent_size: 2 });
    fs.writeFile(path + filename, text, function() {});
};

module.exports = Logger;