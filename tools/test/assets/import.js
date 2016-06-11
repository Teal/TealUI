
var exports = this;
var module = { exports: exports };
var require = importModule;

function importModule(path) {
    document.write('<script type="text/javascript" src="../../../TealUI_build/lib/' + path + '.js" ><\/script>');
}
