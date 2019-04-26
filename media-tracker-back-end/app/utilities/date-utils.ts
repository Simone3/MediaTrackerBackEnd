import { AppError } from "app/models/error/error";

/**
 * Some utilities for dates
 */
class DateUtils {

	/**
     * Formats a possibly partial date-string from single numeric values. If some are missing, the last day of the month/day is taken.
	 * Input and output are all in UTC.
     * @param year the year
     * @param month the optional month (1-12)
     * @param day the optional day
     */
	public dateStringFromYearMonthDay(year: number, month?: number, day?: number): string {
		
		if(month && (month <= 0 || month > 12)) {

			throw AppError.GENERIC.withDetails(`Month ${month} is not valid`);
		}

		if(day && (day <= 0 || day > 31)) {

			throw AppError.GENERIC.withDetails(`Day ${day} is not valid`);
		}

		const dateYear: number = year;
		let dateMonth: number;
		let dateDay: number;

		if(month) {

			dateMonth = month - 1;
			
			if(day) {

				dateDay = day;
			}
			else {
	
				dateMonth += 1;
				dateDay = 0;
			}
		}
		else {

			dateMonth = 12;
			dateDay = 0;
		}

		const date: Date = new Date(Date.UTC(dateYear, dateMonth, dateDay, 0, 0, 0, 0));
		
		return date.toISOString();
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();
