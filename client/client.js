var net = require('net');
var inquirer = require('inquirer');

var Communication = require('./modules/communication');
var Config = require('./modules/config');
var GameController = require('./modules/gamecontroller');

var Client = {};
Client.communication = null;

Client.auth = function(callback) {
    var request = {
        type:'authenticate',
        name: Config.profile.name,
        avatar: Config.profile.avatar,
        token: Config.profile.token,
        profil: Config.profile.profil
    };

    var authListener = function(data) {
        var response = data;
        if (response.type && response.type === 'id' && response.id) {
            Communication.MyId = response.id;
            console.log('Authentication success, ID: ', response.id);
            callback && callback();
        }
        else {
            console.error('Authentication error, exiting');
            process.exit(0);
        }
    };

    Client.communication.setListener(authListener);

    Client.communication.send(request);
};

Client.launchConnection = function () {
    try {
        var socket = net.connect(Config.gameServer, function() {
            Client.communication = new Communication(socket);
            console.log('Connected to server ! (' + Config.gameServer.host + ':' + Config.gameServer.port + ')');

            Client.auth(function() {
                var gamecontroller = new GameController(Client.communication);
                gamecontroller.listen();
            });
        });

        socket.on('error', function(e) {
            switch(e.code) {
                case 'ECONNRESET':
                    console.error('Server went down, stopping');
                    process.exit(0);
                    break;
                case 'ECONNREFUSED':
                    console.error('Server connection impossible');
                    process.exit(0);
                    break;
                default:
                    console.error('Unknown socket error : ', e);
            }
        });

        socket.on('close', function() {
            console.log('Connection closed.');
        });

    }
    catch(e) {
        console.error('Unable to connect', e);
    }
};

Client.askIA = function(callback) {

    if(!Config.IA && Config.IAs.length > 1) {
        inquirer.prompt([
          {
            type: 'list',
            name: 'ia',
            message: 'Choose IA to launch',
            choices: Config.IAs
          }
        ], function( answers ) {
            Config.IA = answers[0];
            callback(answers[0]);
        });
    }
    else {
        callback(Config.IAs[Config.IA].value);
    }
};

Client.startClient = function() {
    Client.launchConnection();
};

module.exports = Client;
