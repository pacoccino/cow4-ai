var Config = {};

Config.gameServer = {
    host: 'qualif.codeofwar.net',
    port: 8127
};

// useless
Config.IAs = [
    {
        name: 'Basic',
        value: 'BasicIA'
    }
];

Config.IAid = 0;

Config.seletedIA = Config.IAs[0].value;

module.exports = Config;
