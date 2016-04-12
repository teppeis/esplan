'use strict';

var assert = require('assert');
var esprima = require('esprima');
var espurify = require('espurify');
var esplan = require('../');

describe('esplan', function() {
  context('without assertions', function() {
    it('inserts assert.$$plan(0, $done)', function() {
      assertInstrument(
                'it("foo", function() {});',
                'it("foo", function($$done) {assert.$$plan(this, 0, $$done);});'
            );
    });
  });

  context('with 1 assertion', function() {
    it('inserts assert.$$plan(1, $done)', function() {
      assertInstrument(
                'it("foo", function() {assert(true);});',
                'it("foo", function($$done) {assert.$$plan(this, 1, $$done); assert(true);});'
            );
    });

    it('counts assert.ok', function() {
      assertInstrument(
                'it("foo", function() {assert.ok(true); assert.foo(true);});',
                'it("foo", function($$done) {assert.$$plan(this, 1, $$done); assert.ok(true); assert.foo(true);});'
            );
    });
  });

  context('with 2 assertions', function() {
    it('inserts assert.$$plan(2, $done)', function() {
      assertInstrument(
                'it("foo", function() {assert(true); assert(false);});',
                'it("foo", function($$done) {assert.$$plan(this, 2, $$done); assert(true); assert(false);});'
            );
    });
  });

  context('if original testcase has done', function() {
    it('inserts assert.$$reset()', function() {
      assertInstrument(
                'it("foo", function(done) {assert(true);});',
                'it("foo", function(done) {assert.$$reset(); assert(true);});'
            );
    });
  });

  function assertInstrument(originalCode, expectedCode) {
    var ast = esprima.parse(originalCode);
    var actual = esplan(ast);
    var expected = esprima.parse(expectedCode);
    assert.deepEqual(espurify(actual), espurify(expected));
  }
});
