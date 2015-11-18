var Client = require('./client');
var Config = require('./modules/config');
var Constants = require('./modules/constants');
var IA = require('./modules/ia');

var profile = {
    name: 'Skuzer',
    avatar:'https://i.imgflip.com/t257l.jpg',
    token: 'ed4ccb622d819fb6b35133db689ad97e',
    profil: Constants.GameProfiles.MASTER_OF_COINS
};

Config.profile = profile;
Config.IA = IA;

Config.real = true;

Client.startClient();