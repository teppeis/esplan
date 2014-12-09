'use strict';

/**
 * @param {Function} original Original assert method
 * @return {Function} instrumented assert method
 */
function register(original) {
    var current = 0;
    var expected = 0;
    var doneFunc = null;

    var afterAssert = function() {
        current++;
        if (expected === current) {
            if (doneFunc) {
                doneFunc();
            }
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
     * @param {number} expectedTests
     * @param {Function} done
     */
    newAssert.$$plan = function(expectedTests, done) {
        if (expectedTests === 0) {
            throw new Error('At least one assertion is required in each test case.');
        }
        current = 0;
        expected = expectedTests;
        doneFunc = done;
    };

    /**
     */
    newAssert.$$reset = function() {
        current = 0;
        expected = 0;
        doneFunc = null;
    };

    return newAssert;
}

module.exports = register;
