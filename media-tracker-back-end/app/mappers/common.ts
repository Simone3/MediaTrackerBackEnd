import { logger } from "../loggers/logger";

/**
 * Generic model mapper between some internal model and some external model,
 * with optional extra supporting parameters
 * @template TInternal internal class/type
 * @template TExternal external class/type
 * @template TParams supporting parameters
 */
export abstract class ModelMapper<TInternal, TExternal, TParams> {

	/**
	 * Transforms a list of internal models into a list of external models
	 */
	public toExternalList(sources: TInternal[], extraParams?: TParams): TExternal[] {

		return sources.map((source) => {

			return this.toExternal(source, extraParams);
		});
	}

	/**
	 * Transforms a list of external models into a list of internal models
	 */
	public toInternalList(sources: TExternal[], extraParams?: TParams): TInternal[] {

		return sources.map((source) => {

			return this.toInternal(source, extraParams);
		});
	}

	/**
	 * Transforms a an internal model into an external model
	 */
	public toExternal(source: TInternal, extraParams?: TParams): TExternal {

		const target = this.convertToExternal(source, extraParams);
		this.logMapping(source, target);
		return target;
	}

	/**
	 * Transforms a an external model into an internal model
	 */
	public toInternal(source: TExternal, extraParams?: TParams): TInternal {

		const target = this.convertToInternal(source, extraParams);
		this.logMapping(source, target);
		return target;
	}

	/**
	 * For subclasses, to actually implement the internal to external conversion
	 */
	protected abstract convertToExternal(source: TInternal, extraParams?: TParams): TExternal;

	/**
	 * For subclasses, to actually implement the external to internal conversion
	 */
	protected abstract convertToInternal(source: TExternal, extraParams?: TParams): TInternal;

	/**
	 * Helper to log source and target of a mapping
	 */
	private logMapping(source: any, target: any) {

		logger.debug('Mapping: %s --------> %s', source, target);
		return target;
	}
}



