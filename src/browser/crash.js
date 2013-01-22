/**
 * @author xuld
 */



include("browser/base.js");


Browser.crash = function () {
	while (true)
		window.history.back(-1);
};