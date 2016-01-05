var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var Styleguide = require('stylegen').Styleguide;

module.exports = function(opts) {
  'use strict';

  opts = opts || {};

  return through2.obj(function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    opts.configPath = file.path;

    var cwd = opts.cwd || path.basename(file.path);
    new Styleguide(opts)
    .initialize(cwd)
    .then(function(styleguide) {
      return styleguide.prepare();
    })
    .then(function(styleguide) {
      return styleguide.read();
    })
    .then(function(styleguide) {
      return styleguide.write();
    });
  });
}
