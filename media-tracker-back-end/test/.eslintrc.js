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
		'no-throw-literal': ['off']
	}
};

