'use strict';

var fs = require('fs');
var path = require('path');

var glob = require('glob');
var mkdirp = require('mkdirp');
var esprima = require('esprima');
var escodegen = require('escodegen');

var esplan = require('../');

var dir = __dirname + '/esplanned-test';
mkdirp.sync(dir);

var files = glob.sync(__dirname + '/test/*.js');

files.forEach(function(file) {
    var ast = esprima.parse(fs.readFileSync(file));
    var code = escodegen.generate(esplan(ast));
    fs.writeFileSync(dir + '/' + path.basename(file), code);
});
