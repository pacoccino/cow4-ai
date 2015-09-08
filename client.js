var net = require('net');
var Communication = require('./modules/communication');
var Config = require('./modules/config');
var AI = require('./modules/ai');

var myId = {
    name: Config.myId.name,
    avatar: Config.myId.avatar
};

var communication;

var auth = function() {
    var request = {
        type:'authenticate',
        name: myId.name,
        avatar: myId.avatar
    };

    var authListener = function(data) {
        var response = data;
        if (response.type && response.type === 'id' && response.id) {
            myId.id = response.id;
            console.log("Authentication success, ID: ", myId.id);
            //listenGame();
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
        auth();
    });

    client.on('end', function() {
        console.log('disconnected from server');
    });

}
catch(e) {
    console.error("Unable to connect", e);
}