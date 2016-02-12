var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var Styleguide = require('stylegen').Styleguide;
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.bold.green;

var PLUGIN_NAME = 'gulp-stylegen';

module.exports = function(opts) {
  'use strict';

  opts = opts || {};
  var initializationErrorFlag = true;

  return through2.obj(function(file, enc, callback) {
    initializationErrorFlag = false;

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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
      return callback(null, file);
    })
    .catch(function(e) {
      return callback(new gutil.PluginError(PLUGIN_NAME, e));
    });

  }, function (cb) {
		if (initializationErrorFlag) {
  		return cb(new gutil.PluginError(PLUGIN_NAME, "No Config-File given, please provide a valid stylguide.(yaml|json) file"));
    }

    cb();
	});
}
