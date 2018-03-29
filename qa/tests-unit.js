var fortune = require('../lib/fortune');
var expect = require('chai').expect;

suite('Forune cookie tests', function() {
    test('getFortune() should return a fortune', function() {
        expect(typeof fortune.getFortune() === 'string');
    });
});