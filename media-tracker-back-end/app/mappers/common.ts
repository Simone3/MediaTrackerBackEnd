import { logger } from "../loggers/logger";

/**
 * Generic model mapper between some internal model (I) and some external model (E),
 * with optional extra supporting parameters (P)
 */
export abstract class ModelMapper<I, E, P> {

	/**
	 * Transforms a list of internal models into a list of external models
	 */
	public toExternalList(sources: I[], extraParams?: P): E[] {

		return sources.map((source) => {

			return this.toExternal(source, extraParams);
		});
	}

	/**
	 * Transforms a list of external models into a list of internal models
	 */
	public toInternalList(sources: E[], extraParams?: P): I[] {

		return sources.map((source) => {

			return this.toInternal(source, extraParams);
		});
	}

	/**
	 * Transforms a an internal model into an external model
	 */
	public toExternal(source: I, extraParams?: P): E {

		const target = this.convertToExternal(source, extraParams);
		this.logMapping(source, target);
		return target;
	}

	/**
	 * Transforms a an external model into an internal model
	 */
	public toInternal(source: E, extraParams?: P): I {

		const target = this.convertToInternal(source, extraParams);
		this.logMapping(source, target);
		return target;
	}

	/**
	 * For subclasses, to actually implement the internal to external conversion
	 */
	protected abstract convertToExternal(source: I, extraParams?: P): E;

	/**
	 * For subclasses, to actually implement the external to internal conversion
	 */
	protected abstract convertToInternal(source: E, extraParams?: P): I;

	/**
	 * Helper to log source and target of a mapping
	 */
	private logMapping(source: any, target: any) {

		logger.debug('Mapping: %s --------> %s', source, target);
		return target;
	}
}



