/*
 * Regex2.js
 * Copyright 2003, 2004 Anthony M. Humphreys <anthony(at)humphreys.org>
 *
 * Permission is granted to use and modify this script for any purpose,
 * provided that this credit header is retained, unmodified, in the script.
 *
 */

// global variables:
var theCount = 0;
TheExpression = new String();

function setUpFlags () {
	var flags = '';
	theCount = 1;
	if (RegExTest.ignoreCaseFlag) {
		flags = flags + 'i';
	};
	if (RegExTest.globalFlag) {
		flags = flags + 'g';
	};
	if (RegExTest.multiLineFlag) {
		flags = flags + 'm';
	};
	return flags;
};

function fixExpression () {
	if (RegExTest.regExType == 'string') {
		eval('TheExpression = \'' + RegExTest.theExpression + '\';');
	} else {
		//var TheExpression = new String();
		TheExpression = RegExTest.theExpression;
		TheExpression = TheExpression.replace(/\\\//g,'/');
	};
};

function findMatch () {
	var flags = setUpFlags();
	CopyUp();
	fixExpression();
	var re = new RegExp (TheExpression,flags);
	var theText = RegExTest.theText.replace(re,highlightMatches);
	RegExTest.theOutput = theText.replace(/\v|\r\n|\r|\n/g,'<BR>\r\n');
	CopyDown();
};

function highlightMatches (match) {
	if (theCount % 2) {
		var sixtieth = '<SPAN CLASS=\"hio\">';
	} else {
		var sixtieth = '<SPAN CLASS=\"hie\">';
	};
	sixtieth = sixtieth + match;
	sixtieth = sixtieth + '</SPAN>';
	theCount = theCount+1;
	return sixtieth;
};

function findReplace () {
	var flags = setUpFlags();
	CopyUp();
	fixExpression();
	var re = new RegExp (TheExpression,flags);
	if (RegExTest.replaceType == 'string') {
		var theText = RegExTest.theText.replace(re,ReplaceMatches);
	} else {
		var tmp = 'var theText = RegExTest.theText.replace(re,' + RegExTest.replaceString + ');'
		eval(tmp);
	};
	RegExTest.theOutput = theText.replace(/\v|\r\n|\r|\n/g,'<BR>\r\n');
	CopyDown();
};

function ReplaceMatches (match) {
	if (theCount % 2) {
		var sixtieth = '<SPAN CLASS=\"hio\">';
	} else {
		var sixtieth = '<SPAN CLASS=\"hie\">';
	};
	if (arguments.length > 3) {
		var replaceString = RegExTest.replaceString
		for (var i = 1; i<(arguments.length-2);i++) {
			eval('replaceString = replaceString.replace(/\\$'+i+'/g,\''+ arguments[i]+'\');')
		}
		sixtieth = sixtieth + replaceString;
	} else {
		sixtieth = sixtieth + RegExTest.replaceString;
	};
	sixtieth = sixtieth + '</SPAN>';
	theCount = theCount+1;
	return sixtieth;
};

function findSplit () {
	var flags = setUpFlags();
	CopyUp();
	fixExpression();
	var re = new RegExp (TheExpression,flags);
	var theText = '<TABLE BORDER=\"1\"><TR><TD CLASS=\"hio\">' + RegExTest.theText.replace(re,splitMatches) + '</TD></TR></TABLE>';
	RegExTest.theOutput = theText.replace(/\v|\r\n|\r|\n/g,'<BR>\r\n')
	CopyDown();
};
function splitMatches(match) {
		if (theCount % 2) {
			var sixtieth = '</TD><TD CLASS=\"hio\">';
		} else {
			var sixtieth = '</TD><TD CLASS=\"hie\">';
		};
	theCount = theCount+1;
	return sixtieth;
};