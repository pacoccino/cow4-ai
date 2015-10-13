var Config = {};

Config.profile = {
    name: 'pacia',
    avatar:'http://2.gravatar.com/avatar/543b0381d275eb738a562a1bd35dea2a',
    token: '',
    profil: 1
};

Config.gameServer = {
    host: 'localhost',
    port: 8127
};

Config.IAs = [
    {
        name: 'Basic',
        value: 'BasicIA'
    }
];

Config.IA = 0;

Config.seletedIA = Config.IAs[0].value;

module.exports = Config;
