var Client = require('./client');
var Config = require('./modules/config');
var Constants = require('./modules/constants');
var IA = require('./modules/ia');

var profile = {
    name: 'Skuzer',
    avatar:'',
    token: '',
    profil: Constants.GameProfiles.MASTER_OF_COINS
};

Config.profile = profile;
Config.IA = IA;

Config.real = true;

Client.startClient();