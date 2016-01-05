var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var Styleguide = require('stylegen').Styleguide;
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.bold.green;

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
    console.log(success("initialize styleguide ..."));
    new Styleguide(opts)
    .initialize(cwd)
    .then(function(styleguide) {
      console.log(success("preparing styleguide ..."));
      return styleguide.prepare();
    })
    .then(function(styleguide) {
      console.log(success("reading styleguide ..."));
      return styleguide.read();
    })
    .then(function(styleguide) {
      console.log(success("writing styleguide ..."));
      return styleguide.write();
    })
    .then(function() {
      console.log(success("styleguide written"));
      return callback();
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
