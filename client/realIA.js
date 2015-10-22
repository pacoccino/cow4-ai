var Client = require('./client');
var Config = require('./modules/config');
var IA = require('./modules/ia');

var profile = {
    name: 'pacia',
    avatar:'http://2.gravatar.com/avatar/543b0381d275eb738a562a1bd35dea2a',
    token: '',
    profil: 1
};

Config.profile = profile;
Config.IA = IA;

Client.startClient();