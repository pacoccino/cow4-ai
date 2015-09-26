var Action = require('../modules/action');
var chai = require('chai');
var expect = chai.expect;

var action

describe('Action', function() {

    beforeEach(function() {
        action = new Action();
    });

    it('creates', function() {
        expect(action.type).to.be.defined;
        expect(action.value).to.be.defined;
    });

    it('sets move action', function() {
        action.move(12);

        expect(action.type).to.equal('move');
        expect(action.value).to.equal(12);
    });


    it('get server action', function() {
        action.move(12);

        var serverAction = action.getServerAction();

        expect(serverAction.type).to.equal('move');
        expect(serverAction.target).to.equal(12);
    });
});