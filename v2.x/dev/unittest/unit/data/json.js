

test("JSON.decode", function () {
	return
	expect(8);

	equal(JSON.decode(), null, "Nothing in, null out.");
	equal(JSON.decode(null), null, "Nothing in, null out.");
	equal(JSON.decode(""), null, "Nothing in, null out.");

	deepEqual(JSON.decode("{}"), {}, "Plain object parsing.");
	deepEqual(JSON.decode("{\"test\":1}"), { "test": 1 }, "Plain object parsing.");

	deepEqual(JSON.decode("\n{\"test\":1}"), { "test": 1 }, "Make sure leading whitespaces are handled.");

	try {
		JSON.decode("{a:1}");
		ok(false, "Test malformed JSON string.");
	} catch (e) {
		ok(true, "Test malformed JSON string.");
	}

	try {
		JSON.decode("{'a':1}");
		ok(false, "Test malformed JSON string.");
	} catch (e) {
		ok(true, "Test malformed JSON string.");
	}
});