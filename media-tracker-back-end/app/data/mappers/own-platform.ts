import { ModelMapper } from 'app/data/mappers/common';
import { IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { AppError } from 'app/data/models/error/error';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

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
			color: source.color
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
			owner: extraParams.userId,
			category: extraParams.categoryId
		};
	}
}

/**
 * Singleton instance of the own platforms mapper
 */
export const ownPlatformMapper = new OwnPlatformMapper();

