'use strict';

module.exports = {
	extends: ['../.eslintrc.js'],
	'env': {
		'mocha': true
	},
	rules: {

		// Disable for Chai assertions
		'no-unused-expressions': ['off'],

		// Disable for semplicity
		'no-throw-literal': ['off'],

		// Disable for Mocha callbacks that require access to "this"
		'prefer-arrow-callback': ['off']
	}
};

