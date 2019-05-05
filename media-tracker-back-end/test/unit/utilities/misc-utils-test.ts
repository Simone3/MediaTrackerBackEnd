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

		it('Should merge numeric promises', async() => {

			const promise1: Promise<number> = new Promise((resolve) => {

				resolve(3);
			});

			const promise2: Promise<number[]> = new Promise((resolve) => {

				resolve([ 5, 1 ]);
			});

			const promise3: Promise<number> = new Promise((resolve) => {

				resolve(9);
			});

			const result = await miscUtils.mergeAndSumPromiseResults([ promise1, promise2, promise3 ]);

			expect(result).to.equal(18);
		});

		it('Should merge numeric promises with errors', async() => {

			const promise1: Promise<number> = new Promise((resolve) => {

				resolve(3);
			});

			const promise2: Promise<number[]> = new Promise((resolve) => {

				resolve([ 5, 1 ]);
			});

			const promise3: Promise<number> = new Promise((_, reject) => {

				reject('Some error!');
			});

			try {

				await miscUtils.mergeAndSumPromiseResults([ promise1, promise2, promise3 ]);
			}
			catch(error) {

				expect(error).to.equal('Some error!');
				return;
			}
			
			throw 'mergeAndSumPromiseResults should have returned an error';
		});
	});
});
