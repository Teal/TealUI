

// this a sample testcase.


// framewroks
var framewroks = {
		
	// Name of the framewrok.
	'framework1': {
		
		// Main modules of the framework, this can be an array if more than one js file is required
		js: 'demo.js',  // ['../libs/demo2.js', '../libs/demo3.js']
		
		// init testing when document is loaded.
		init:  function(window){
	
		}
	},
	
	'framework2': {
		
		js: 'demo.js',
		
		init:  function(window){
	
		}
	}
	
};

// testcases
var cases = {
		
	// test name
	'test':{
		
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