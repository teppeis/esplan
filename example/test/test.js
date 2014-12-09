'use strict';

var Promise = require('ypromise');

var esplan = require('../../');
var assert = esplan.register(require('assert'));

describe('Promise', function() {
    function mayBeResolveWithOne() {
        // return Promise.resolve(1); // correct
        return Promise.resolve(2); // bug
    }

    it('ignores an assertion error in `then` function', function() {
        mayBeResolveWithOne().then(function(value) {
            assert.equal(value, 1);
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
