'use strict';
var Promise = require('ypromise');
var esplan = require('../../');
var assert = esplan.register(require('assert'));
describe('Promise', function () {
    function syncOrAsyncCallback(callback) {
        callback();
        return true;
    }
    it('wait until all assertions are completed', function ($$done) {
        assert.$$plan(this, 2, $$done);
        var result = syncOrAsyncCallback(function () {
            assert(true);
        });
        assert(result);
    });
    function mayBeResolve() {
        return Promise.resolve([
            'foo',
            'wrong value!'
        ]);
    }
    it('can not detect an assertion error in `then` function', function ($$done) {
        assert.$$plan(this, 3, $$done);
        mayBeResolve().then(function (value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
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