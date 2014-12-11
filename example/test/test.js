'use strict';

var Promise = require('ypromise');

var esplan = require('../../');
var assert = esplan.register(require('assert'));

describe('Promise', function() {
    function syncOrAsyncCallback(callback) {
        callback();
        return true;
    }

    it('wait until all assertions are completed', function() {
        var result = syncOrAsyncCallback(function() {
            assert(true);
        });
        assert(result);
    });

    function mayBeResolve() {
        // return Promise.resolve(['foo', 'bar']); // correct
        return Promise.resolve(['foo', 'wrong value!']);// bug
    }

    it('can not detect an assertion error in `then` function', function() {
        mayBeResolve().then(function(value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
        });
    });

    function mayBeRejected(){ 
        // return Promise.reject(new Error('woo')); // correct
        return Promise.resolve('woo'); // bug
    }

    it('can not detect if mayBeRejected() resolves promise in the wrong', function () {
        return mayBeRejected().catch(function (error) {
            assert(error.message === 'woo');
        });
    });
});
