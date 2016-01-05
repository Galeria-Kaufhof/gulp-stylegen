var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var Styleguide = require('stylegen').Styleguide;
var chalk = require('chalk');
var error = chalk.bold.red;

module.exports = function(opts) {
  'use strict';

  opts = opts || {};
  var initializationError = new gutil.PluginError('gulp-stylegen', "No Config-File given, please provide a valid stylguide.(yaml|json) file");

  return through2.obj(function(file, enc, callback) {
    error = null;

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-stylegen', 'Streaming not supported'));
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
    })
    .then(function() {
      return callback(gutil.PluginError('gulp-stylegen', "OMGS"), file);
    })
    .catch(function(e) {
      throw new gutil.PluginError('gulp-stylegen', e);
      return callback();
    });


  }, function (cb) {
		if (initializationError !== null) {
      console.log(error(initializationError));
    }
		cb();
	});
}
