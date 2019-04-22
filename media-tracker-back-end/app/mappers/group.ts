import { GroupInternal } from '../models/internal/group';
import { IdentifiedGroup } from '../models/api/group';
import { ModelMapper } from './common';

/**
 * Helper type
 */
type GroupMapperParams = {
	userId: string,
	categoryId: string
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
			throw "convertToInternal.extraParams cannot be undefined"
		}

		return {
			_id: (source.uid ? source.uid : null),
			name: source.name,
			owner: extraParams.userId,
			category: extraParams.categoryId
		};
	}
}

/**
 * Singleton instance of the groups mapper
 */
export const groupMapper = new GroupMapper();


