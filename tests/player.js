var Player = require('../client/modules/player');
var Cell = require('../client/modules/cell');

var chai = require('chai');
var expect = chai.expect;

var player;

describe('Player', function () {

    beforeEach(function () {
        player = new Player();
    });

    it('creates', function () {
        expect(player instanceof Player).to.be.true;


        expect(player.id).to.equal(0);
    });

    it('clones', function() {

        player.id = 45;
        player.name = "bob";
        player.avatar = "j.jpg";

        player.items = [12,13];
        player.pm = 3;
        player.invisibilityDuration = 13;

        player.cellId = 45;

        var newPlayer = player.clone();

        expect(newPlayer.id).to.equal(player.id);
        expect(newPlayer.name).to.equal(player.name);
        expect(newPlayer.avatar).to.equal(player.avatar);

        expect(newPlayer.items).not.to.equal(player.items);
        expect(newPlayer.items.length).to.equal(player.items.length);
        expect(newPlayer.items[0]).to.equal(player.items[0]);

        expect(newPlayer.pm).to.equal(player.pm);
        expect(newPlayer.invisibilityDuration).to.equal(player.invisibilityDuration);

        expect(newPlayer.cellId).to.equal(player.cellId);
    });

});