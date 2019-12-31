import { ModelMapper } from 'app/data/mappers/common';
import { GroupFilter, IdentifiedGroup } from 'app/data/models/api/group';
import { AppError } from 'app/data/models/error/error';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';

/**
 * Helper type
 */
type GroupMapperParams = {
	userId: string;
	categoryId: string;
};

/**
 * Mapper for groups
 */
class GroupMapper extends ModelMapper<GroupInternal, IdentifiedGroup, GroupMapperParams> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: GroupInternal): IdentifiedGroup {
		
		return {
			uid: source._id,
			name: source.name
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedGroup, extraParams?: GroupMapperParams): GroupInternal {
		
		if(!extraParams) {
			throw AppError.GENERIC.withDetails('convertToInternal.extraParams cannot be undefined');
		}

		return {
			_id: source.uid ? source.uid : null,
			name: source.name,
			owner: extraParams.userId,
			category: extraParams.categoryId
		};
	}
}

/**
 * Mapper for group filters
 */
class GroupFilterMapper extends ModelMapper<GroupFilterInternal, GroupFilter, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: GroupFilterInternal): GroupFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GroupFilter): GroupFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the groups mapper
 */
export const groupMapper = new GroupMapper();

/**
 * Singleton instance of the group filter mapper
 */
export const groupFilterMapper = new GroupFilterMapper();

