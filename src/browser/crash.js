/**
 * @author xuld
 */



using("System.Browser.Base");


Browser.crash = function () {
	while (true)
		window.history.back(-1);
};