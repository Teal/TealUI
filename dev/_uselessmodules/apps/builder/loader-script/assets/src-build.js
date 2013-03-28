/*bpm 
   loader:script,
   basePath:../../../src,
   currentPath:assets
*/

// baseUrl: '实际引用的 basePath 地址（如 CDN ）',  默认 = basePath
// currentUrl: '实际引用的 basePath 地址',  默认 = currentPath

include("dom/base.js");
include("./path/to/module.js");

/* The Code below is created by a tool.*/

function include() {

}

function exclude() {

}

(function () {

    var basePath = '../../../src';
    var currentPath = 'assets/';
    var cssPaths = [];
    var jsPaths = [currentPath + 'path/to/module.js'];

    var i, pi;

    for (i = 0; pi = cssPaths[i++];) {
        document.write('<link rel="stylesheet" href="' + pi + '">');
    }

    for (i = 0; pi = jsPaths[i++];) {
        document.write('<script type="text/javascript" src="' + pi + '"></script>');
	}

})();

//(function (baseUrl, cssPaths, jsPaths) {

//    var i, pi;

//    for (i = 0; pi = cssPaths[i++];) {
//        document.write('<link rel="stylesheet" href="' + baseUrl + pi + '">');
//    }

//    for (i = 0; pi = jsPaths[i++];) {
//        document.write('<script type="text/javascript" src="' + baseUrl + pi + '"></script>');
//    }

//})('../../../src', ['core/base.css'], ['core/base.js', 'dom/base.js']);

/* The Code above is created by a tool.*/


