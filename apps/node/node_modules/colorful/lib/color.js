/*
 * Color supports in terminal
 * @author: Hsiaoming Yang <lepture@me.com>
 *
 * Thanks to: https://github.com/lepture/terminal
 *
 */

var tty = require('tty');
var os = require('os');
var codes = {};

exports.isatty = false;

function isColorSupported() {
  // you can force to tty
  if (!exports.isatty && !tty.isatty()) return false;

  if ('COLORTERM' in process.env) return true;
  // windows will support color
  if (os.type() === 'Windows_NT') return true;

  var term = process.env.TERM;
  if (!term) return false;

  term = term.toLowerCase();
  if (term.indexOf('color') != -1) return true;
  return term === 'xterm' || term === 'linux';
}

function esc(code) {
  return '\x1b[' + code + 'm';
}

function colorize(name, text) {
  if (!isColorSupported()) {
    return text;
  }
  var code = codes[name];
  if (!code) {
    return text;
  }
  return code[0] + text + code[1];
}

var styles = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  blink: [5, 25],
  inverse: [7, 27],
  strike: [9, 29]
};

for (var name in styles) {
  var code = styles[name];
  codes[name] = [esc(code[0]), esc(code[1])];
}

var colors = [
  'black', 'red', 'green', 'yellow', 'blue',
  'magenta', 'cyan', 'white'
];

for (var i = 0; i < colors.length; i++) {
  codes[colors[i]] = [esc(i + 30), esc(39)];
  codes[colors[i] + '_bg'] = [esc(i + 40), esc(49)];
}

codes.gray = codes.grey = [esc(90), esc(39)];
codes.gray_bg = codes.grey_bg = [esc(40), esc(49)];

function Color(obj) {
  this.string = obj;
  this.color = obj;
}
Color.prototype.valueOf = function() {
  return this.color;
};

exports.color = {};
Object.keys(codes).forEach(function(style) {
  Object.defineProperty(Color.prototype, style, {
    get: function() {
      this.color = colorize(style, this.color);
      return this;
    }
  });

  exports.color[style] = function(text) {
    return colorize(style, text);
  };
});
Object.defineProperty(Color.prototype, 'style', {
  get: function() {
    return this.color;
  }
});

exports.paint = function(text) {
  return new Color(text);
};

exports.colorful = function() {
  if (String.prototype.to) return;

  Object.defineProperty(String.prototype, 'to', {
    get: function() { return new Color(this.valueOf()); }
  });
};

Object.defineProperty(exports, 'isSupported', {
  get: isColorSupported
});
