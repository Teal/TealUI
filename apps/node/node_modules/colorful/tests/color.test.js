var color = require('../lib/color');
var paint = color.paint;
var should = require('should');
color.isatty = true;

describe('Color', function() {
  it('should be supported', function() {
    should.exists(color.isSupported);
  });
  it('should be red hello', function() {
    paint('hello').red.color.should.equal('\x1b[31mhello\x1b[39m');
    paint('hello').red.style.should.equal('\x1b[31mhello\x1b[39m');
  });
  it('should be colorful string', function() {
    should.not.exists(String.prototype.to);
    color.colorful();
    should.exists(String.prototype.to);
  });
  it('should be underline red hello', function() {
    'hello'.to.underline.red.color.should.equal('\x1b[31m\x1b[4mhello\x1b[24m\x1b[39m');
    'hello'.to.underline.red.string.should.equal('hello');
  });
});
