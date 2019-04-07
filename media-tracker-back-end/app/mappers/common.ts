import { logger } from "../loggers/logger";

/**
 * Common mapper that contains util methods
 */
export abstract class AbstractMapper {

	/**
	 * Helper to log source and target of a mapping and then return the target
	 */
	protected logMapping <T> (source: any, target: T): T {

		logger.debug('Mapping: %s --------> %s', source, target);
		return target;
	}
}



