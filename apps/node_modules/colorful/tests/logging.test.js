var Logging = require('../lib/logging').Logging;
var should = require('should');

describe('Logging', function() {
  it('should config level', function() {
    var logger = new Logging();
    logger.level.should.equal('info');
    logger.config('debug');
    logger.level.should.equal('debug');

    logger.config({'quiet': true});
    logger.level.should.equal('warn');

    logger.config({'verbose': true});
    logger.level.should.equal('debug');

    logger.config({'level': 'info'});
    logger.level.should.equal('info');
  });
  it('should do nothing', function() {
    var logger = new Logging();
    logger.debug('this is debug');
    logger.info('this is info');
    logger.start('Hello world');
    logger.config({icons: {startIcon: '+'}});

    logger.start('Hello world');
    logger.config({colors: {info: null}});
    logger.info('this is info');
  });
});

