var net = require('net');
var Communication = require('./modules/communication');
var Config = require('./modules/config');
var AI = require('./modules/ai');

var communication;

var auth = function(callback) {
    var request = {
        type:'authenticate',
        name: Config.myId.name,
        avatar: Config.myId.avatar
    };

    var authListener = function(data) {
        var response = data;
        if (response.type && response.type === 'id' && response.id) {
            communication.setId(response.id);
            console.log("Authentication success, ID: ", myId.id);
            callback && callback();
        }
        else {
            console.error("Authentication error");
        }
    };

    communication.setListener(authListener);

    communication.send(request);
};

try {
    var client = net.connect(Config.gameServer, function() {
        communication = new Communication(client);
        console.log('connected to server!');

        auth(function() {
            var ai = new AI(communication);
            ai.listen.call(ai);
        });
    });

    client.on('end', function() {
        console.log('disconnected from server');
    });

}
catch(e) {
    console.error("Unable to connect", e);
}
