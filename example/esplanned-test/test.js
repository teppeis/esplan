'use strict';
var Promise = require('ypromise');
var esplan = require('../../');
var assert = esplan.register(require('assert'));
describe('Promise', function () {
    function mayBeResolveWithOne() {
        return Promise.resolve(2);
    }
    it('ignores an assertion error in `then` function', function ($$done) {
        assert.$$plan(this, 1, $$done);
        mayBeResolveWithOne().then(function (value) {
            assert.equal(value, 1);
        });
    });
    function mayBeRejected() {
        return Promise.resolve('woo');
    }
    it('can not detect if mayBeRejected() resolves promise in the wrong', function ($$done) {
        assert.$$plan(this, 1, $$done);
        return mayBeRejected().catch(function (error) {
            assert(error.message === 'woo');
        });
    });
});