'use strict';

var Promise = require('ypromise');

var esplan = require('../../');
var assert = esplan.register(require('assert'));

describe('Promise', function() {
    it('should use `done` for test?', function() {
        Promise.resolve().then(function() {
            assert(false);
        });
    });

    it('5000ms enable', function(done) {
        this.enableTimeouts(true);
        setTimeout(done, 5000);
    });


    it('5000ms disable', function(done) {
        this.enableTimeouts(false);
        setTimeout(done, 5000);
    });

    it('5000ms no enable', function(done) {
        // this.enableTimeouts(false);
        setTimeout(done, 5000);
    });
});
