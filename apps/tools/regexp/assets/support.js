/*
 * support.js
 * Frame Support functions
 *
 * Copyright 2003,2004 Anthony M. Humphreys <anthony(at)humphreys.org>
 *
 * Permission is granted to use and modify this script for any purpose,
 * provided that this credit header is retained, unmodified, in the script.
 *
 */

 // Walks through all of the frames starting at the very top level
function CopyUpFrames(theFrame) {
	for (i=0;i<theFrame.length;i++) {
		// Call copyUp() in each page of the frameset
		if (theFrame[i].copyUp) {
			theFrame[i].copyUp();
		};
		// if the page contains frames, walk through those too
		if (theFrame[i].frames.length) {
			CopyUpFrames(theFrame[i].frames);
		};
	};
};

// Walk through all of the frames starting at the very top level, which this is
function CopyUp() {
	if (top.frames.length) {
		CopyUpFrames(top.frames);
	};
};

// Walks through all of the frames starting at the very top level
function CopyDownFrames(theFrame) {
	for (i=0;i<theFrame.length;i++) {
		// Call copyDown() in each page of the frameset
		if (theFrame[i].copyDown) {
			theFrame[i].copyDown();
		};
		// if the page contains frames, walk through those too
		if (theFrame[i].frames.length) {
			CopyDownFrames(theFrame[i].frames);
		};
	};
};

// Walk through all of the frames starting at the very top level, which this is
function CopyDown() {
	if (top.frames.length) {
		CopyDownFrames(top.frames);
	};
};