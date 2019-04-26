import { miscUtils } from 'app/utilities/misc-utils';
import chai from 'chai';

const expect = chai.expect;

/**
 * Tests for the misc utilities
 */
describe('MiscUtils Tests', () => {
	
	describe('MiscUtils Tests', () => {

		it('Should correctly merge URLs', (done) => {

			expect(miscUtils.buildUrl([ 'http://something', '/other', 'a/', 'test', '/value/', '/end' ])).to.equal('http://something/other/a/test/value/end');
			
			done();
		});

		it('Should correctly merge URLs with path params', (done) => {

			expect(miscUtils.buildUrl([ 'http://something/:myValue/myValue', '/:somethingElse' ], {
				myValue: 'abcdefg',
				somethingElse: '123'
			})).to.equal('http://something/abcdefg/myValue/123');
			
			done();
		});

		it('Should escape a RegExp', (done) => {

			expect(miscUtils.escapeRegExp('a normal string')).to.equal('a normal string');

			expect(miscUtils.escapeRegExp('a .* string')).to.equal('a \\.\\* string');

			expect(miscUtils.escapeRegExp('a (string')).to.equal('a \\(string');
			
			done();
		});

		it('Should parse a boolean', (done) => {

			expect(miscUtils.parseBoolean('true')).to.equal(true);
			
			expect(miscUtils.parseBoolean('1')).to.equal(true);

			expect(miscUtils.parseBoolean('false')).to.equal(false);

			expect(miscUtils.parseBoolean('0')).to.equal(false);

			expect(miscUtils.parseBoolean('tru')).to.equal(false);

			expect(miscUtils.parseBoolean('dfgxcvxcvsdf')).to.equal(false);

			done();
		});
	});
});
