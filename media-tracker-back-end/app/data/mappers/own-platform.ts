import { ModelMapper } from 'app/data/mappers/common';
import { IdentifiedOwnPlatform, OwnPlatformFilter } from 'app/data/models/api/own-platform';
import { AppError } from 'app/data/models/error/error';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Helper type
 */
type OwnPlatformMapperParams = {
	userId: string;
	categoryId: string;
};

/**
 * Mapper for platforms where some user owns some media items
 */
class OwnPlatformMapper extends ModelMapper<OwnPlatformInternal, IdentifiedOwnPlatform, OwnPlatformMapperParams> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: OwnPlatformInternal): IdentifiedOwnPlatform {
		
		return {
			uid: source._id,
			name: source.name,
			color: source.color,
			icon: source.icon
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedOwnPlatform, extraParams?: OwnPlatformMapperParams): OwnPlatformInternal {
		
		if(!extraParams) {
			throw AppError.GENERIC.withDetails('convertToInternal.extraParams cannot be undefined');
		}

		return {
			_id: source.uid ? source.uid : null,
			name: source.name,
			color: source.color,
			icon: source.icon,
			owner: extraParams.userId,
			category: extraParams.categoryId
		};
	}
}

/**
 * Mapper for own platform filters
 */
class OwnPlatformFilterMapper extends ModelMapper<OwnPlatformFilterInternal, OwnPlatformFilter, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: OwnPlatformFilterInternal): OwnPlatformFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: OwnPlatformFilter): OwnPlatformFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the own platforms mapper
 */
export const ownPlatformMapper = new OwnPlatformMapper();

/**
 * Singleton instance of the own platform filter mapper
 */
export const ownPlatformFilterMapper = new OwnPlatformFilterMapper();

