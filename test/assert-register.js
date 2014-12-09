'use strict';

var assert = require('assert');
var expect = require('expect.js');
var sinon = require('sinon');

var register = require('../lib/assert-register');

var originalAssertEqual = assert.equal;

describe('assert-register', function() {
    var sut;
    beforeEach(function() {
        sut = register(assert);
    });

    it('does not change original assert methods', function() {
        expect(assert.equal).to.be(originalAssertEqual);
    });

    describe('$$plan()', function() {
        it('plans expected test cases', function() {
            var spy = sinon.spy();
            sut.$$plan(2, spy);
            assert.equal(spy.callCount, 0);
            sut(true);
            assert.equal(spy.callCount, 0);
            sut(true);
            assert.equal(spy.callCount, 1);
        });

        it('throws if expected test cases is 0', function() {
            expect(function() {
                sut.$$plan(0);
            }).to.throwError();
        });
    });
});
