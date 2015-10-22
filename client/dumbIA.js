var Client = require('./client');
var Config = require('./modules/config');
var IA = require('./modules/iaennemy');

var profile = {
    name: 'dumb',
    avatar:'http://vignette2.wikia.nocookie.net/doblaje/images/7/70/Lloyd_Christmas_Tonto.gif/revision/latest?cb=20130226235316&path-prefix=es',
    token: '',
    profil: 1
};

Config.profile = profile;
Config.IA = IA;

Client.startClient();