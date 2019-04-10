import { GroupInternal } from '../models/internal/group';
import { IdentifiedGroup, Group } from '../models/api/group';
import { AbstractMapper } from './common';

/**
 * Helper class to translate between internal and public group models
 */
class GroupMapper extends AbstractMapper {

	/**
	 * List of internal models to list of public models
	 */
	public internalToApiList(sources: GroupInternal[]): IdentifiedGroup[] {

		return sources.map((source) => {

			return this.internalToApi(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public internalToApi(source: GroupInternal): IdentifiedGroup {
		
		return this.logMapping(source, {
			uid: source._id,
			name: source.name
		});
	}

	/**
	 * List of public models to list of internal models
	 */
	public apiToInternalList<T extends (IdentifiedGroup | Group)>(sources: T[], userId: string, categoryId: string): GroupInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source, userId, categoryId);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal<T extends (IdentifiedGroup | Group)>(source: T, userId: string, categoryId: string): GroupInternal {

		const isNew = (source instanceof Group);
		const id = (isNew ? null : (<IdentifiedGroup>source).uid);

		return this.logMapping(source, {
			_id: id,
			name: source.name,
			owner: userId,
			category: categoryId
		});
	}
}

/**
 * Singleton instance of the groups mapper
 */
export const groupMapper = new GroupMapper();


