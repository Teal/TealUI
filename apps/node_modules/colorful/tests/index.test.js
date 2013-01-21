var colorful = require('../index');
var should = require('should');

describe('index', function() {
  it('should be supported', function() {
    should.exists(colorful.isSupported);
  });
  it('should be red hello', function() {
    colorful.paint('hello').red.color.should.equal('\x1b[31mhello\x1b[39m');
  });
  it('has logging', function() {
    colorful.logging.info('hello');
  });
});

