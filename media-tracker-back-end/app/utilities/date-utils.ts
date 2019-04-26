/**
 * Some utilities for dates
 */
class DateUtils {

	/**
     * Formats a possibly partial date-string from single numeric values, e.g. (2019, 04, 23) -> 2019-04-23; (2019, 04) -> 2019-04
     * @param year the year
     * @param month the optional month (1-12)
     * @param day the optional day
     */
	public dateStringFromYearMonthDay(year: number, month?: number, day?: number): string {
		
		let stringDate = String(year);
		if(month) {

			stringDate += `-${month}`;

			if(day) {

				stringDate += `-${day}`;
			}
		}
		const date: Date = new Date(stringDate);
		return date.toISOString();
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();
