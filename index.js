'use strict';

var esquery = require('esquery');
var estemplate = require('estemplate');

var register = require('./lib/assert-register');

var planTmpl = estemplate.compile('assert.$$plan(<%= tests %>, $$done);');
var resetTmpl = estemplate.compile('assert.$$reset();');

var assertMatchers = [
    esquery.parse('CallExpression[callee.name="assert"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="ok"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="equal"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="notEqual"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="deepEqual"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="notDeepEqual"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="strictEqual"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="notStrictEqual"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="throws"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="doesNotThrows"]'),
    esquery.parse('CallExpression > MemberExpression[object.name="assert"][property.name="ifError"]')
];

/**
 * @param {Object} ast
 * @return {Object} instrumented AST
 */
function esplan(ast) {
    var testcases = esquery(ast, 'CallExpression[callee.name="it"] > FunctionExpression');
    testcases.forEach(function(testcase) {
        if (testcase.params.length > 0) {
            testcase.body.body.unshift(resetTmpl({}).body[0]);
            return;
        }

        testcase.params.push({
            'type': 'Identifier',
            'name': '$$done'
        });

        var numOfAssertions = 0;
        assertMatchers.forEach(function(assertMatcher) {
            numOfAssertions += esquery.match(testcase, assertMatcher).length;
        });
        
        testcase.body.body.unshift(planTmpl({
            tests: {
                'type': 'Literal',
                'value': numOfAssertions
            }
        }).body[0]);
    });

    return ast;
}

esplan.register = register;
module.exports = esplan;
