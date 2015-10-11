var Route = require('../modules/route');

var chai = require('chai');
var expect = chai.expect;

describe('Route', function() {

    it('create', function() {


        var route = new Route("a", "b");
        expect(route.source).to.equal("a");
        expect(route.destination).to.equal("b");

        expect(route.path.length).to.equal(0);
        expect(route.cellPath.length).to.equal(0);
        expect(route.items.length).to.equal(0);
        expect(route.length).to.equal(0);

    });

    it('clones', function() {


        var route = new Route("a", "b");

        route.path.push(3);
        route.cellPath.push(3);
        route.items.push(3);
        route.length = 54;

        var clone = route.clone();

        expect(clone.source).to.equal("a");
        expect(clone.destination).to.equal("b");

        expect(clone.path.length).to.equal(1);
        expect(clone.path[0]).to.equal(3);
        expect(clone.cellPath.length).to.equal(1);
        expect(clone.cellPath[0]).to.equal(3);
        expect(clone.items.length).to.equal(1);
        expect(clone.length).to.equal(54);
    });

});