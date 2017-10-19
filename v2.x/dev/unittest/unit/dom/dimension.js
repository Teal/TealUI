module("cpre/base:dimension", { teardown: moduleTeardown });


Dom.implement({

	hide: function () {
		return Dom.iterate(this, Dom.hide);
	},

	show: function () {
		return Dom.iterate(this, Dom.hide);
	}
});


test("Dom.prototype.getWidth", function() {
	expect(9);

	var $div = Dom.query("#nothiddendiv");
	$div.setWidth( 30 );
	equal($div.getWidth(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.getWidth(), 30, "Test hidden div");
	$div.show();
	$div.setWidth(-1); // handle negative numbers by setting to 0 #11604
	equal($div.getWidth(), 0, "Test negative width normalized to 0");
	$div.setStyle("padding", "20px");
	equal($div.getWidth(), 0, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equal($div.getWidth(), 0, "Test border specified with pixels");

	Object.extend($div[0].style, { display: "", border: "", padding: "" });

	Object.extend(Dom.query("#nothiddendivchild")[0].style, { width: '20px', padding: "3px", border: "2px solid #fff" });
	equal(Dom.get("nothiddendivchild").getWidth(), 20, "Test child width with border and padding");
	Object.extend(Dom.query("#nothiddendiv")[0].style, { border: "", padding: "", width: "" });
	Object.extend(Dom.query("#nothiddendivchild")[0].style, { border: "", padding: "", width: "" });

	var blah = Dom.query("blah");
	equal(blah.setWidth(10), blah, "Make sure that setting a width on an empty set returns the set.");
	equal(blah.getWidth(), null, "Make sure 'null' is returned on an empty set");

	equal(Dom.get(document).getWidth(), document.documentElement.clientWidth, "Window width is equal to width reported by window/document.");

});

test("Dom.prototype.getHeight", function() {
	expect(9);

	var $div = Dom.query("#nothiddendiv");
	$div.setHeight( 30 );
	equal($div.getHeight(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.getHeight(), 30, "Test hidden div");
	$div.show();
	$div.setHeight(-1); // handle negative numbers by setting to 0 #11604
	equal($div.getHeight(), 0, "Test negative Height normalized to 0");
	$div.setStyle("padding", "20px");
	equal($div.getHeight(), 0, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equal($div.getHeight(), 0, "Test border specified with pixels");

	Object.extend($div[0].style, { display: "", border: "", padding: "" });

	Object.extend(Dom.query("#nothiddendivchild")[0].style, { height: '20px', padding: "3px", border: "2px solid #fff" });
	equal(Dom.get("nothiddendivchild").getHeight(), 20, "Test child Height with border and padding");
	Object.extend(Dom.query("#nothiddendiv")[0].style, { border: "", padding: "", height: "" });
	Object.extend(Dom.query("#nothiddendivchild")[0].style, { border: "", padding: "", height: "" });

	var blah = Dom.query("blah");
	equal(blah.setHeight(10), blah, "Make sure that setting a Height on an empty set returns the set.");
	equal(blah.getHeight(), null, "Make sure 'null' is returned on an empty set");

	equal(Dom.get(document).getHeight(), document.documentElement.clientHeight, "Window Height is equal to Height reported by window/document.");

});

test("child of a hidden elem has accurate getWidth()/getHeight()  see #9441 #9300", function() {
	
	// setup html
    var $divNormal       = Dom.parse("<div>").setStyle('width', "100px").setStyle('height', "100px").setStyle('border', "10px solid white").setStyle('padding', "2px").setStyle('margin', "3px"),
		$divChild        = $divNormal.clone(),
		$divHiddenParent = Dom.parse("<div>").setStyle( "display", "none" ).append( $divChild ).appendTo();
	$divNormal.appendTo("body");

	// tests that child div of a hidden div works the same as a normal div
	equal( $divChild.getWidth(), $divNormal.getWidth(), "child of a hidden element getWidth() is wrong see #9441" );
	
	equal( $divChild.getHeight(), $divNormal.getHeight(), "child of a hidden element getHeight() is wrong see #9441" );
	
	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("Dom.prototype.getSize", function() {

	equal( Dom.document.getSize().y > 0, true, "Test on document without margin option" );
	
	var $div = Dom.get("nothiddendiv");
	$div.setStyle("height", 30);

	equal($div.getSize().y, 30, "Test with only width set");
	$div.setStyle("padding", "20px");
	equal($div.getSize().y, 70, "Test with padding");
	$div.setStyle("border", "2px solid #fff");
	equal($div.getSize().y, 74, "Test with padding and border");
	$div.setStyle("margin", "10px");
	equal($div.getSize().y, 74, "Test with padding, border and margin without margin option");
	$div.hide();
	equal($div.getSize().y, 0, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.set({ display: "", border: "", padding: "", width: "", height: "" });

	var div = Dom.parse( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.getSize().y, 0, "Make sure that disconnected nodes are handled." );

	div.remove();
});

testIframe("iframe", "iframe document size", function( window ) {
    expect(2);

    ok(Dom.get(window.document).getHeight() > 0, "document height is larger than 0");
    ok(Dom.get(window.document).getWidth() > 0, "document width is larger than 0");
});
