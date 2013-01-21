/*
 * Nested color logging support for terminal
 * @author: Hsiaoming Yang <lepture@me.com>
 *
 * Thanks to: https://github.com/lepture/terminal
 *
 */

var util = require('util');
var os = require('os');
var EventEmitter = require('events').EventEmitter;
var color = require('./color');
var paint = color.paint;
var count = 0;

var _levels = {
  'debug': 10,
  'info': 20,
  'warn': 30,
  'error': 40,
  'log': 50
};

function colorize(name, text) {
  var func;
  if (typeof name === 'string') {
    func = color.color[name]
  } else if (typeof name === 'function') {
    func = name;
  }
  if (!func) return text;
  return func(text);
};


function log(context, level, args) {
  if (_levels[context.level] > _levels[level]) return;

  var text = '';
  var stream = process.stdout;
  text += Array(count + 1).join('  ');
  if (count) {
    text += context.icons.logIcon;
  }
  if (level === 'error') {
    stream = process.stderr;
  }
  var name = context.colors[level];
  text += colorize(name, util.format.apply(context, args)) + os.EOL;
  stream.write(text);
}

function Logging(level) {
  this.level = level || 'info';
}
Logging.prototype.__proto__ = EventEmitter.prototype;

if (os.type() === 'Windows_NT') {
  Logging.prototype.icons = {
    logIcon: paint('|- ').cyan.color,
    startIcon: paint('# ').bold.magenta.color,
    endIcon: paint('*- ').cyan.color
  };
} else {
  Logging.prototype.icons = {
    logIcon: paint('➠ ').cyan.color,
    startIcon: paint('⚑ ').bold.magenta.color,
    endIcon: paint('➥ ').cyan.color
  };
}
Logging.prototype.colors = {
  debug: 'grey',
  info: 'green',
  warn: 'yellow',
  error: 'red'
};
Logging.prototype.start = function() {
  if (_levels[this.level] > 25) return;

  var text = Array(count + 1).join('  ');
  text += this.icons.startIcon;
  text += paint(util.format.apply(this, arguments)).bold.color + os.EOL;
  process.stdout.write(text);
  count += 1;
  this.emit('logging-start');
};
Logging.prototype.end = function() {
  if (_levels[this.level] > 25) return;
  var text = '';
  text += Array(count + 1).join('  ');
  if (count) {
    text += this.icons.endIcon;
  }
  text += util.format.apply(this, arguments) + os.EOL;
  process.stdout.write(text);
  count -= 1;
  this.emit('logging-end');
};
Logging.prototype.log = function() {
  log(this, 'log', arguments);
};
Logging.prototype.debug = function() {
  log(this, 'debug', arguments);
};
Logging.prototype.info = function() {
  log(this, 'info', arguments);
};
Logging.prototype.warn = function() {
  log(this, 'warn', arguments);
  this.emit('logging-warn');
};
Logging.prototype.error = function() {
  log(this, 'error', arguments);
  this.emit('logging-error');
};
Logging.prototype.config = function(obj) {
  var self = this;
  if (obj.verbose) {
    self.level = 'debug';
  }
  if (obj.quiet) {
    self.level = 'warn';
  }
  if (obj.level) {
    self.level = obj.level;
  }
  if (obj in _levels) {
    self.level = obj;
  }

  if (obj.colors) {
    Object.keys(obj.colors).forEach(function(key) {
      self.colors[key] = obj.colors[key];
    });
  }
  if (obj.icons) {
    Object.keys(obj.icons).forEach(function(key) {
      self.icons[key] = obj.icons[key];
    });
  }
};

exports = module.exports = new Logging;
exports.Logging = Logging
