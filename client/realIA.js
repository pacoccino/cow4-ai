var Client = require('./client');
var Config = require('./modules/config');
var IA = require('./modules/ia');

var profile = {
    name: 'Skuzer',
    avatar:'https://i.imgflip.com/t257l.jpg',
    token: '',
    profil: 1
};

Config.profile = profile;
Config.IA = IA;

Config.real = true;

Client.startClient();