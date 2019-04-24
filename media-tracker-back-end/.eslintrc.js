'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
	'@typescript-eslint/indent': ['error', 'tab'],
	'jsx-quotes': ['error', 'prefer-single'],
	'quotes': ['error', 'single'],
	'@typescript-eslint/prefer-interface': ['off'],
	'@typescript-eslint/camelcase': ['error', {'allow': ['api_key', 'append_to_response', 'field_list']}],
	'@typescript-eslint/no-parameter-properties': ['off'],
	'@typescript-eslint/explicit-function-return-type': ['error', {'allowExpressions': true}]
  }
};

