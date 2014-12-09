esplan [![build status][travis-image]][travis-url]
======

## Desctiption

Count assertions in your test cases with static code analysis before execution and wait until all assertions are completed.

## Example

Input: 
```javascript
var esplan = require('../../');
var assert = esplan.register(require('assert'));

describe('Promise', function() {
    it('can not detect an assertion error in `then` function', function() {
        mayBeResolve().then(function(value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
        });
    });
```

Output: 
```javascript
var esplan = require('../../');
var assert = esplan.register(require('assert'));

describe('Promise', function () {
    it('can not detect an assertion error in `then` function', function($$done) { // `$$done` is added!
        assert.$$plan(this, 3, $$done); // this line is inserted!
        mayBeResolve().then(function (value) {
            assert.equal(value.length, 2);
            assert.equal(value[0], 'foo');
            assert.equal(value[1], 'bar');
        });
    });
});
```

Result (If `mayBeResolve()` returns wrong value `['foo', 'wrong value!']`):
```console
Error: Expected 3 assertions, but actually 2 assertions called
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[travis-image]: https://travis-ci.org/teppeis/esplan.svg?branch=master
[travis-url]: https://travis-ci.org/teppeis/esplan
