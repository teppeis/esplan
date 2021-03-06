esplan
======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
![MIT License][license]

## Description

Count assertions in your test cases with static code analysis before execution and wait until all assertions are completed.


## Example

Input: 
```javascript
var esplan = require('esplan');
var assert = esplan.register(require('assert'));

describe('Promise', function() {
    it('can not detect an assertion error in `then` function', function() {
        mayBeResolve().then(function(value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
        });
    });
});
```

Output: 
```javascript
var esplan = require('esplan');
var assert = esplan.register(require('assert'));

describe('Promise', function () {
    // `$$done` is added!
    it('can not detect an assertion error in `then` function', function($$done) {
        assert.$$plan(this, 3, $$done); // this line is inserted!
        mayBeResolve().then(function (value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
        });
    });
});
```

Result (If `mayBeResolve()` returns wrong value `['foo', 'wrong!']`):
```console
Error: Expected 3 assertions, but actually 2 assertions called
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/esplan.svg
[npm-url]: https://npmjs.org/package/esplan
[travis-image]: https://travis-ci.org/teppeis/esplan.svg?branch=master
[travis-url]: https://travis-ci.org/teppeis/esplan
[deps-image]: https://david-dm.org/teppeis/esplan.svg
[deps-url]: https://david-dm.org/teppeis/esplan
[license]: https://img.shields.io/npm/l/esplan.svg
