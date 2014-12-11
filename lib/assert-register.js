'use strict';

/**
 * @param {Function} original Original assert method
 * @return {Function} instrumented assert method
 */
function register(original) {
    var current = 0;
    var expected = 0;
    var doneFunc = null;
    var timer = null;

    var afterAssert = function() {
        current++;
        if (expected === current) {
            if (doneFunc) {
                doneFunc();
            }
            newAssert.$$reset();
        }
    };

    var newAssert = function() {
        original.apply(null, Array.prototype.slice.call(arguments));
        afterAssert();
    };

    newAssert.fail = original.fail;

    [
        'ok',
        'equal',
        'notEqual',
        'deepEqual',
        'notDeepEqual',
        'strictEqual',
        'notStrictEqual',
        'throws',
        'doesNotThrows',
        'ifError',
    ].forEach(function(method) {
        newAssert[method] = function() {
            original[method].apply(original, Array.prototype.slice.call(arguments));
            afterAssert();
        };
    });

    /**
     * @param {Mocha.Context} ctx Mocha context object
     * @param {number} expectedTests
     * @param {Function} done
     * @throws {Error} If expectedTests is 0
     */
    newAssert.$$plan = function(ctx, expectedTests, done) {
        if (expectedTests === 0) {
            throw new Error('At least one assertion is required in each test case.');
        }

        newAssert.$$reset();
        expected = expectedTests;
        doneFunc = done;

        var timeout = ctx.timeout();
        ctx.enableTimeouts(false);
        timer = setTimeout(function() {
            if (done) {
                done(new Error('Expected ' + expected + ' assertions, but actually ' + current + ' assertions called'));
            }
        }, timeout);
    };

    /**
     */
    newAssert.$$reset = function() {
        current = 0;
        expected = 0;
        doneFunc = null;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return newAssert;
}

module.exports = register;
