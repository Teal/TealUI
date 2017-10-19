/* *****************************************************************************
 *
 * Copyright (c) 2011 Xuld. All rights reserved.
 * 
 * This source code is part of the SpeedMatch .
 * 
 * This code is licensed under MIT license.
 * See the file License.html for the license details.
 * 
 * 
 * You must not remove this notice, or any other, from this software.
 *
 * 
 * ******************************************************************************/

var current = null,
	Lang = {
		cases: 'cases',
		sum: 'total'
	},
	defaultOptions = {
		time: 1000,     // times of each test case to run for.
		rootPath: '',   // the directoy of test case file.
		html: 'testcase.html',    //  the default html.
		eclipseLength: 100,  //  If the length of code is greater than eclipseLength, it will be trimed.
		timeout: 1000    // If .js file is not loaded, JPlus will wait for timeout * 10(times) ms.
	};

if (location.search) {
	window.onload = function () {

		var url = location.search.substr(1);
		if (url.indexOf('&disableUrl=false') >= 0) {
			url = url.replace('&disableUrl=false', '');
		} else {
			disableUrl();
		}

		document.getElementById('url').value = url;


		openTestCase(url);
	}

}

/**
 * init speed match with the given test cases.
 * @param {Object} frameworks this should be an object like: {@code <<<{
 *  	'test': {
 *  		js: '../libs/demo.js',  // the target js file
 *  		css: '', // the target css file
 *  		html: '', // the target css file
 *  		init:  function(window){
 *  			// Callback to initialize the document.
 *  		}
 *  	}
 *  } >>>}
 * @param {Object} testcases all testcases represented by an object where the key is name of framework and the value is the string, which is going to be evaluted.
 * @param {Object} [options] this argument allows you to overwrite the default options.
 */
function initSpeedMatch(frameworks, testcases, options) {
	current = compile(frameworks, testcases, options);
	initIFrame(current);
	initTable(current);
}

Array.prototype.forEach = Array.prototype.forEach || function (value, bind) {
	for (var i = 0; i < this.length; i++) {
		value.call(bind, this[i], i, this);
	}
};

function openTestCase(url) {
	stopSpeedMatch();
	defaultOptions.rootPath = (url.match(/[\S\s]*\//) || [""])[0];
	appendScript(document, url);
}

function startSpeedMatch(row, cell) {
	if (!current)
		return;

	var cellMax = current[0].length, rowMax = current.length - 1, timeout = current.options.timeout;
	current.timer = setInterval(function () {
		if (current.loadingCount && timeout-- > 0) {
			return;
		}


		if (cell < cellMax) {
			testOne(row, cell);
			cell++;
		} else {
			updateMatches(row);
			row++;
			if (row == rowMax) {
				sum();
				return stopSpeedMatch();
			}
			cell = 1;
		}
	}, 10);

}

function stopSpeedMatch() {
	if (!current)
		return;
	clearInterval(current.timer);
}

function compile(frameworks, testcases, options) {
	var r = [[{ text: Lang.cases }]], map = {}, lastRow = [{ text: Lang.sum }];

	r.options = {};
	options = options || r.options;
	for (var item in defaultOptions)
		r.options[item] = item in options ? options[item] : defaultOptions[item];

	for (var framework in frameworks) {
		map[framework] = r[0].length;
		r[0].push({ text: framework, cfg: frameworks[framework] });
		lastRow.push({ text: framework, result: NaN });
	}

	for (var testcase in testcases) {

		var value = testcases[testcase],
			cs = [{ text: testcase }];

		if (value === '-' || value === undefined) {
			r.push(cs);
			continue;
		}

		for (var framework in value) {
			var index = map[framework];
			if (index > 0) {
				cs[index] = {
					text: value[framework]
				};
			}
		}

		if (value.time)
			cs[0].time = value.time;

		r.push(cs);

	}

	r.push(lastRow);
	return r;


}

function initIFrame(current) {

	var frameworks = current[0], frames = document.getElementById('frames');

	emptyNode(frames);

	current.loadingCount = 0;

	frameworks.forEach(function (value, index) {
		if (index == 0)
			return;

		// initialize iframe.
		var iframe = value.iframe = document.createElement('iframe');

		value = value.cfg;

		var js = typeof value.js === 'string' ? [value.js] : value.js ? value.js.slice(0) : [];

		current.loadingCount += 1 + (js ? js.length : 0);

		iframe.onload = function () {
			if (js.length)
				loadScript();
			current.loadingCount--;
		};

		function loadScript() {
			var script = js.shift();
			script = appendScript(iframe.contentWindow.document, script);
			script[-[1, ] ? 'onload' : 'onreadystatechange'] = function () {
				if (script.readyState === 'loading')
					return;
				current.loadingCount--;

				if (js.length) {
					loadScript();
					return;
				}

				if (value.init) {
					value.init(iframe.contentWindow);
				}
			};
		}

		iframe.src = current.options.rootPath + (value.html || current.options.html);
		frames.appendChild(iframe);


	});

}

function initTable(current) {
	var table = document.getElementById('testcases'), tr, td;

	emptyNode(table);
	table = table.appendChild(document.createElement('tbody'));

	current.forEach(function (value, index) {
		tr = document.createElement('tr');
		if (0 === index || current.length === index + 1) {
			value.forEach(function (framework, index) {
				td = document.createElement('th');
				td.innerHTML = htmlEncode(framework.text);
				tr.appendChild(td);
			});
		} else if (value.length === 1) {
			td = document.createElement('th');
			td.colSpan = current[0].length;
			td.innerHTML = htmlEncode(value[0].text);
			td.className = 'testcase';
			tr.appendChild(td);
		} else {
			value.forEach(function (testcase, index) {
				if (testcase) {
					td = document.createElement('td');
					if (0 === index) {
						td.innerHTML = htmlEncode(testcase.text);
						td.className = 'testcase';
						td.ondblclick = onRowDblClick;
					} else {
						td.title = testcase.text;
						td.ondblclick = onCellDblClick;
						td.innerHTML = htmlEncode(eclipse(testcase.text, current.options.eclipseLength));
					}
					tr.appendChild(td);
				}
			});
		}
		table.appendChild(tr);
	});



}

function emptyNode(elem) {
	while (elem.lastChild)
		elem.removeChild(elem.lastChild);
}

function appendScript(document, url) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	(document.getElementsByTagName('head')[0] || document).appendChild(script);
	return script;
}

/**
 * Start test one case.
 * @param {Number} row the row index.
 * @param {Number} column the column index.
 */
function testOne(row, column) {
	var cell = current[row];
	if (!cell)
		return;
	cell = cell[column];
	if (!cell || cell.text === '-')
		return;
	var time = current[row][0].time || current.options.time,
		iframe = current[0][column].iframe;

	try {
		iframe.contentWindow.eval('var __timer = new Date(), __times = ' + time + '; while(__times--){' + cell.text + '} __timer = new Date() - __timer;');
		time = iframe.contentWindow.__timer;
	} catch (e) {
		time = e;
	}
	var td = document.getElementById('testcases').rows[row].cells[column];
	td.innerHTML = '<span class="time">' + time + '</span> |' + htmlEncode(eclipse(cell.text, current.options.eclipseLength));
	if (typeof time !== 'number') {
		td.className = 'error';
	} else {
		cell.result = time;
	}


}

function eclipse(v, count) {
	return v.length > count ? v.substr(0, count) + "..." : v;
}

function htmlEncode(value) {
	return value && value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, "<br>").replace(/ /g, "&nbsp;");
}

function onCellDblClick(e) {
	e = e || window.event;
	var td = e.target || e.srcElement;
	while (td.tagName != 'TD')
		td = td.parentNode;

	testOne(td.parentNode.rowIndex, td.cellIndex);
	updateMatches(td.parentNode.rowIndex);
}

function onRowDblClick(e) {
	e = e || window.event;
	var td = e.target || e.srcElement;
	while (td.tagName != 'TR')
		td = td.parentNode;

	for (var i = 1; i < current[0].length; i++)
		testOne(td.rowIndex, i);
	updateMatches(td.rowIndex);
}

function updateMatches(row) {
	if (!current[row])
		return;
	var testcases = current[row], max = -Infinity, min = Infinity, maxIndecies = [], minIndecies = [], cells = document.getElementById('testcases').rows[row].cells;

	for (var i = 1; i < testcases.length; i++) {
		if (cells[i].className !== 'error')
			cells[i].className = '';
		var v = testcases[i].result;
		if (typeof v === 'number') {
			cells[i].className = 'normal';
			if (v > max) {
				maxIndecies[0] = i;
				maxIndecies.length = 1;
				max = v;
			} else if (v == max) {
				maxIndecies.push(i);
			}

			if (v < min) {
				minIndecies[0] = i;
				minIndecies.length = 1;
				min = v;
			} else if (v == min) {
				minIndecies.push(i);
			}
		}

	}

	maxIndecies.forEach(function (index) {
		cells[index].className = 'worst';
	});

	minIndecies.forEach(function (index) {
		cells[index].className = 'best';
	});
}

function sum() {
	for (var i = 1, row = current.length - 1, cells = document.getElementById('testcases').rows[row].cells, lastRow = current[row]; i < current[0].length; i++) {
		lastRow[i] = 0;
		for (var j = 1; j < row; j++) {
			if (current[j][i] && typeof current[j][i].result === 'number')
				lastRow[i] += current[j][i].result;
		}

		cells[i].innerHTML = current[0][i].text + " - " + lastRow[i];
	}

	updateMatches(row);
}

function disableUrl() {
	document.getElementById('openUrl').style.display = 'none';
}