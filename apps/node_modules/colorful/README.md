# Colorful

It's not just color, it's everything colorful in terminal.

---------------------

# Color

Color in terminal and only terminal.

## Programmer

As a programmer, you think they are functions:

```javascript
var color = require('colorful').color
color.red('hello')
color.underline('hello')
color.red(color.underline('hello'))
```

## Human

As a human, you think you are a painter:

```javascript
var paint = require('colorful').paint
paint('hello').red.color
paint('hello').bold.underline.red.color
```

**WTF**, is bold, underline a color? If you don't like the idea, try:

```javascript
paint('hello').bold.underline.red.style
```

## Alien

As an alien, you are from outer space, you think it should be:

```javascript
require('colorful').colorful()
'hello'.to.red.color
'hello'.to.underline.bold.red.color
'hello'.to.underline.bold.red.style
```

## Detective

As a detective, you think we should detect if color is supported:

```javascript
require('colorful').isSupported
```

------

# Logging

Colorful and nested logging in terminal.

[![nico](http://lab.lepture.com/nico/nico-look.png)](http://lab.lepture.com/nico/)

## Favorite

Default is my favorite, we should do nothing:

```javascript
var logging = require('colorful').logging;
// start a nested logging
logging.start('Start Application')
logging.info('send an info message')

// start another nested logging
logging.start('Start subprocess')
logging.warn('send a warn message')
logging.end('End subprocess')

logging.error('send an error message')
logging.debug('send a debug message')
logging.end('End Application')
```

## Config

I want to show debug message:

```javascript
logging.config('debug')
// or
logging.config({level: 'debug'})
logging.config({verbose: true})
```

## Customize
