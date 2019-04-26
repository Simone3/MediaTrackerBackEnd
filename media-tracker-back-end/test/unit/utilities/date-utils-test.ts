import { AppError } from 'app/models/error/error';
import { dateUtils } from 'app/utilities/date-utils';
import chai from 'chai';

const expect = chai.expect;

/**
 * Tests for the date utilities
 */
describe.only('DateUtils Tests', () => {
		
	const check = (value: string, expected: string): void => {

		expect(value).to.satisfy((str: string) => {
			return str.startsWith(expected);
		});
	};

	describe('DateUtils Tests', () => {

		it('Should correctly parse dates from numbers', async() => {

			check(dateUtils.dateStringFromYearMonthDay(2019, 4, 26), '2019-04-26');
			check(dateUtils.dateStringFromYearMonthDay(2019, 1, 1), '2019-01-01');
			check(dateUtils.dateStringFromYearMonthDay(2019, 12, 31), '2019-12-31');

			check(dateUtils.dateStringFromYearMonthDay(2019, 4), '2019-04-30');
			check(dateUtils.dateStringFromYearMonthDay(2019, 1), '2019-01-31');
			check(dateUtils.dateStringFromYearMonthDay(2019, 12), '2019-12-31');
			check(dateUtils.dateStringFromYearMonthDay(2019, 2), '2019-02-28');
			check(dateUtils.dateStringFromYearMonthDay(2020, 2), '2020-02-29');

			check(dateUtils.dateStringFromYearMonthDay(2019), '2019-12-31');

			expect(() => dateUtils.dateStringFromYearMonthDay(2019, 5, 32)).to.throw(AppError);
			expect(() => dateUtils.dateStringFromYearMonthDay(2019, 50)).to.throw(AppError);
		});
	});
});
