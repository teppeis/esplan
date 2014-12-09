'use strict';

var assert = require('assert');
var expect = require('expect.js');
var sinon = require('sinon');

var register = require('../lib/assert-register');

var originalAssertEqual = assert.equal;

describe('assert-register', function() {
    var sut, clock;
    beforeEach(function() {
        sut = register(assert);
        clock = sinon.useFakeTimers();
    });

    it('does not change original assert methods', function() {
        expect(assert.equal).to.be(originalAssertEqual);
    });

    describe('$$plan()', function() {
        it('plans expected test cases', function() {
            var spy = sinon.spy();
            sut.$$plan(this, 2, spy);
            expect(spy.callCount).to.be(0);
            sut(true);
            expect(spy.callCount).to.be(0);
            sut(true);
            expect(spy.callCount).to.be(1);
        });

        it('throws if expected test cases is 0', function() {
            expect(function() {
                sut.$$plan(this, 0);
            }).to.throwError();
        });

        it('throws if timeout', function() {
            var spy = sinon.spy();
            var mock = {
                timeout: function() {return 1000;},
                enableTimeouts: function() {}
            };
            sut.$$plan(mock, 3, spy);
            sut.ok(true);
            clock.tick(999);
            expect(spy.callCount).to.be(0);

            clock.tick(1);
            expect(spy.callCount).to.be(1);
            expect(spy.args[0][0].toString()).to.be('Error: Expected 3 assertions, but actually 1 assertions called');
        });
    });
});
