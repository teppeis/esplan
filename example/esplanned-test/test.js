'use strict';
var Promise = require('ypromise');
var esplan = require('../../');
var assert = esplan.register(require('assert'));
describe('Promise', function () {
    it('should use `done` for test?', function ($$done) {
        assert.$$plan(1, $$done);
        Promise.resolve().then(function () {
            assert(false);
        });
    });
});