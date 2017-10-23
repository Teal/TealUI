

// this a sample testcase.



// options
var options = {
		
	// Html file to run code in. The url is relative to current js file.
	html: 'demo.html',
	
	// Time to run for each test case. Default to 1000.
	time: 1000,
	
	// the directoy of test case file.
	// rootPath: null,   

	//  If the length of code is greater than eclipseLength, it will be trimed.
	eclipseLength: 100,  
	
	// If .js file is not loaded, JPlus will wait for timeout * 10(times) ms.
	timeout: 1000    
};

// framewroks
var framewroks = {
		
	// Name of the framewrok.
	'framework1': {
		
		// Main modules of the framework, this can be an array if more than one js file is required
		js: 'demo.js',  // ['../libs/demo2.js', '../libs/demo3.js']
		
		// Html file to run code. If empty, options.html is used.
		html: '',
		
		// init testing when document is loaded.
		init:  function(window){
	
		}
	},
	
	'framework2': {
		
		js: 'demo.js',
		
		html: '',
		
		init:  function(window){
	
		}
	}
	
};

// testcases
var cases = {
		
	// test name
	'test':{
		
		// Time to run. If not set, options.time is used.
		time: 1000,
		
		// Code for each frameworks.
		// The field name here must be same defined in object framewroks.
		framework1: 'test()',
		framework2: 'test()'
	}

};




// init speed match ui.
if(window.initSpeedMatch)
	initSpeedMatch(framewroks, cases, options   );


function test(){
	
}