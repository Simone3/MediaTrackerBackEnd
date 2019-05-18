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
		'arrow-body-style': ['off'],

		// Disable for Mocha callbacks that require access to "this"
		'prefer-arrow-callback': ['off'],

		// Console is OK for tests
		'no-console': ['off'],

		// "any" is OK for tests
		'@typescript-eslint/no-explicit-any': ['off'],

		// For JSON sources
		'import/extensions': [ 2, {
			'json': 'off'
		} ]
	}
};

