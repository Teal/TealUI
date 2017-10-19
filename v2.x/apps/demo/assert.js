
/**
 * Assert value equals true, or print a warning in console.
 * @param {Object} value The value to confirm, which will be converted to boolean automatically.
 * @param {String} message="Assert Fails" The message to print if *value* equals **false**.
 * @return {Boolean} Returns the result of assertion.
 * @example <pre>
 * var value = 1;
 * assert(value > 0, "Function#bind(value): value should be greater than 0.");
 * </pre>
 */
function assert(value, message, defaultMessage) {
	if (!value && window.console && console.error) {
		console.error(message ? message.replace("~", defaultMessage) : "Assert Fails");
		return false;
	}

	return true;
}

/**
 * Notify user the usage of current function is deprected and may not be 
 * supported in next release.
 * @param {String} message="This function is deprected." The message to display. 
 * In general, tells user the replacement of current usage.
 */
assert.deprected = function (message) {
	return trace.warn(message || "This function is deprected.");
};

/**
 * Assert the specified variable is a function.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be a function." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 * @example <pre>
 * assert.isFunction(a, "a ~");
 * </pre>
 */
assert.isFunction = function (value, message) {
	return assert(typeof value === 'function', message, "shoud be a function.");
};

/**
 * Assert the specified variable is an array.
 * @param {Object} value The variable to test.
 * @param {String} message="Shoud be an array." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isArray = function (value, message) {
	return assert(typeof value.length === 'number', message, "shoud be an array.");
};

/**
 * Assert the specified variable is a number.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be a number." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isNumber = function (value, message) {
	return assert(typeof value === 'number' || value instanceof Number, message, "shoud be a number.");
};

/**
 * Assert the specified variable is a string.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be a string." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isString = function (value, message) {
	return assert(typeof value === 'string' || value instanceof String, message, "shoud be a string.");
};

/**
 * Assert the specified variable is an object.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be an object." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isObject = function (value, message) {
	return assert(value && (typeof value === "object" || typeof value === "function" || typeof value.nodeType === "number"), message, "shoud be an object.");
};

/**
 * Assert the specified variable is a node or null.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be a node or null." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isNode = function (value, message) {
	return assert(value ? typeof value.nodeType === "number" || value.setTimeout : value === null, message, "shoud be a node or null.");
};

/**
 * Assert the specified variable is an element or null.
 * @param {Object} value The variable to test.
 * @param {String} message="shoud be an element or null." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.isElement = function (value, message) {
	return assert(value ? typeof value.nodeType === "number" || value.style : value === null, message, "shoud be an element or null.");
};

/**
 * Assert the specified variable is not null.
 * @param {Object} value The variable to test.
 * @param {String} message="should not be null or undefined." The message to print if *value* equals 
 * **false**, in which ~ will be replaced by default error message.
 * @return {Boolean} Returns the result of assertion.
 */
assert.notNull = function (value, message) {
	return assert(value != null, message, "should not be null or undefined.");
};
