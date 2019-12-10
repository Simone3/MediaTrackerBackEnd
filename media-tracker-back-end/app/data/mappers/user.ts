import { ModelMapper } from 'app/data/mappers/common';
import { IdentifiedUser } from 'app/data/models/api/user';
import { UserInternal } from 'app/data/models/internal/user';

/**
 * Mapper for users
 */
class UserMapper extends ModelMapper<UserInternal, IdentifiedUser, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: UserInternal): IdentifiedUser {

		return {
			uid: source._id,
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedUser): UserInternal {
		
		return {
			_id: source.uid ? source.uid : null,
			name: source.name
		};
	}
}

/**
 * Singleton instance of the users mapper
 */
export const userMapper = new UserMapper();

