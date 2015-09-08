var net = require('net');
var Communication = require('./modules/communication');

var myId = {
    name: "pacia",
    avatar:'http://2.gravatar.com/avatar/543b0381d275eb738a562a1bd35dea2a'
};

var gameServer = {
    host: "localhost",
    port:8127
};

var communication;

var listenGame = function() {
    client.on('data', function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if(response.type && response.type === 'getTurnOrder') {
            var gameMap = response.data;
            console.log("gameMap : ", gameMap);
        }
    });
}
var auth = function() {
    var request = {
        type:'authenticate',
        name: myId.name,
        avatar: myId.avatar
    };

    client.on('data', function(data) {
        var response = communication.unFormat(data);
        if(response.type && response.type === 'id' && response.id) {
            myId.id = response.id;
            console.log("Authentication success, ID: ", myId.id);
            //listenGame();
        }
        else {
            console.error("Authentication error");
        }
    });

    communication.send(request);
};

var client = net.connect(gameServer, function() {
    communication = new Communication(client);
    console.log('connected to server!');
    auth();
});

client.on('end', function() {
  console.log('disconnected from server');
});
