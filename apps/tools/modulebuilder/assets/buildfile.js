

function BuildFile() {
    this.includes = [];
    this.excludes = [];

    this.compress = false;
    this.removeAssert = false;
    this.removeConsole = false;

    this.path = '';
    this.js = '';
    this.css = '';
    this.images = '';
    this.src = '';
    this.dependencySyntax = 'boot';
    this.uniqueBuildFiles = '';
    this.parseMacro = false;
    this.defines = '';
    this.prependComments = '/*********************************************************\r\n' +
                           ' * This file is created by a tool at {time}\r\n' +
                           ' *********************************************************\r\n' +
                           ' * modules: \r\n' +
                           '{modules}\r\n' +
                           ' ********************************************************/';
    this.prependModuleComments = '/*********************************************************\r\n' +
                                 ' * {module}\r\n' +
                                 ' ********************************************************/';;
}