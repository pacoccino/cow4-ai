var net = require('net');
var Communication = require('./modules/communication');
var Config = require('./modules/config');
var GameController = require('./modules/gamecontroller');

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
            console.log("Authentication success, ID: ", response.id);
            callback && callback();
        }
        else {
            console.error("Authentication error, exiting");
            process.exit(0);
        }
    };

    communication.setListener(authListener);

    communication.send(request);
};

try {
    var client = net.connect(Config.gameServer, function() {
        communication = new Communication(client);
        console.log('Connected to server ! (' + Config.gameServer.host + ':' + Config.gameServer.port + ')');

        auth(function() {
            var gamecontroller = new GameController(communication);
            gamecontroller.listen.call(gamecontroller);
        });
    });

    client.on('error', function(e) {
        switch(e.code) {
            case "ECONNRESET":
                console.error("Served went down, stopping");
                process.exit(0);
                break;
            default:
                console.error('Unknown socket error : ', e);
        }
    });

    client.on('close', function() {
        console.log('Connection closed.');
    });

}
catch(e) {
    console.error("Unable to connect", e);
}
