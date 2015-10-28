var Client = require('./client');
var Config = require('./modules/config');
var Constants = require('./constants');
var IA = require('./modules/ia');

var profile = {
    name: 'Skuzer',
    avatar:'https://i.imgflip.com/t257l.jpg',
    token: '',
    profil: Constants.GameProfiles.MASTER_OF_COINS
};

Config.profile = profile;
Config.IA = IA;

Config.real = true;

Client.startClient();