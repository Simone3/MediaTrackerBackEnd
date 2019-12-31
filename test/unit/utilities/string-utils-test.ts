import { stringUtils } from 'app/utilities/string-utils';
import chai from 'chai';

const expect = chai.expect;

/**
 * Tests for the string utilities
 */
describe('StringUtils Tests', () => {
	
	describe('StringUtils Tests', () => {

		it('Should correctly join plain strings', (done) => {

			expect(stringUtils.join([ 'test', 'another', 'value' ], ', ', 'someDefault')).to.equal('test, another, value');
			done();
		});

		it('Should correctly join plain strings with empty value', (done) => {

			expect(stringUtils.join([ 'test', undefined, 'value' ], ', ', 'someDefault')).to.equal('test, value');
			done();
		});

		it('Should correctly join an undefined array', (done) => {

			expect(stringUtils.join(undefined, ', ', 'someDefault')).to.equal('someDefault');
			done();
		});

		it('Should correctly join an array with all empty values', (done) => {

			expect(stringUtils.join([ '', undefined, null ], ', ', 'someDefault')).to.equal('someDefault');
			done();
		});

		it('Should correctly join an array of objects', (done) => {

			expect(stringUtils.join([{ field: 'test' }, { field: 'another' }, { field: 'value' }], ', ', 'someDefault', [ 'field' ])).to.equal('test, another, value');
			done();
		});

		it('Should correctly join an array of objects with empty values', (done) => {

			expect(stringUtils.join([{ field: undefined }, { field: 'another' }, { field: 'value' }], ', ', 'someDefault', [ 'field' ])).to.equal('another, value');
			done();
		});

		it('Should correctly join an array of objects with multiple properties', (done) => {

			expect(stringUtils.join([{ field: 'test', test: undefined }, { field: 'another', test: 'backup2' }, { field: undefined, test: 'backup3' }], ', ', 'someDefault', [ 'field', 'test' ])).to.equal('test, another, backup3');
			done();
		});
	});
});
