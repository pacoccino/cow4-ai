var AI = function() {

};

var listenGame = function() {
    client.on('data', function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if(response.type && response.type === 'getTurnOrder') {
            var gameMap = response.data;
            console.log("gameMap : ", gameMap);
        }
    });
};


module.exports = AI;