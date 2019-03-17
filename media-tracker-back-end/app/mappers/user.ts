import { UserInternal } from '../models/internal/user';
import { IdentifiedUser, User } from '../models/api/user';

/**
 * Helper class to translate between internal and public user models
 */
class UserMapper {

	/**
	 * List of internal models to list of public models
	 */
	public internalToApiList(sources: UserInternal[]): IdentifiedUser[] {

		return sources.map((source) => {

			return this.internalToApi(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public internalToApi(source: UserInternal): IdentifiedUser {
		
		return {
			uid: source._id,
			name: source.name
		};
	}

	/**
	 * List of public models to list of internal models
	 */
	public apiToInternalList<T extends (IdentifiedUser | User)>(sources: T[]): UserInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal<T extends (IdentifiedUser | User)>(source: T): UserInternal {

		const isNew = (source instanceof User);
		const id = (isNew ? null : (<IdentifiedUser>source).uid);

		return {
			_id: id,
			name: source.name
		};
	}
}

/**
 * Singleton instance of the users mapper
 */
export const userMapper = new UserMapper();


