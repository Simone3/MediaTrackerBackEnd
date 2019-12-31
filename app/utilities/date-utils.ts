import { AppError } from 'app/data/models/error/error';

/**
 * Some utilities for dates
 */
class DateUtils {

	/**
	 * Builds a possibly partial date from single numeric values. If some are missing, the last day of the month/day is taken.
	 * Input and output are all in UTC.
	 * @param year the year
	 * @param month the optional month (1-12)
	 * @param day the optional day
	 * @returns the date
	 */
	public dateFromYearMonthDay(year: number, month?: number, day?: number): Date {
		
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

		return new Date(Date.UTC(dateYear, dateMonth, dateDay, 0, 0, 0, 0));
	}

	/**
	 * Formats a possibly partial date-string from single numeric values. If some are missing, the last day of the month/day is taken.
	 * Input and output are all in UTC.
	 * @param year the year
	 * @param month the optional month (1-12)
	 * @param day the optional day
	 * @returns the date-string
	 */
	public dateStringFromYearMonthDay(year: number, month?: number, day?: number): string {
		
		const date = this.dateFromYearMonthDay(year, month, day);
		return date.toISOString();
	}

	/**
	 * Helper to format a date to ISO string with a null check
	 * @param date the optionally undefined date
	 * @returns undefined if date is undefined, the ISO string otherwise
	 */
	public toString(date: Date | undefined | null): string | undefined {

		return date ? date.toISOString() : undefined;
	}

	/**
	 * Helper to format a list of dates to ISO strings with a null check
	 * @param dates the optionally undefined dates array
	 * @returns undefined if dates is undefined, the array of ISO strings otherwise
	 */
	public toStringList(dates: Date[] | undefined | null): string[] | undefined {

		if(dates) {
			
			return dates.map((date) => {

				return this.toString(date) as string;
			});
		}
		else {
			
			return undefined;
		}
	}

	/**
	 * Helper to parse a UTC date with a null check
	 * @param dateString the optionally undefined string
	 * @returns undefined if dateString is undefined, the parsed date otherwise
	 */
	public toDate(dateString: string | undefined | null): Date | undefined {

		if(dateString) {

			return new Date(dateString);
		}
		else {

			return undefined;
		}
	}

	/**
	 * Helper to parse UTC dates with a null check
	 * @param dateStrings the optionally undefined date strings array
	 * @returns undefined if dateStrings is undefined, the array of parsed dates otherwise
	 */
	public toDateList(dateStrings: string[] | undefined | null): Date[] | undefined {

		if(dateStrings) {
			
			return dateStrings.map((dateString) => {

				return this.toDate(dateString) as Date;
			});
		}
		else {
			
			return undefined;
		}
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();
