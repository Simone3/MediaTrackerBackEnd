import { CategoryInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { UserInternal } from 'app/data/models/internal/user';

/**
 * Model for a group, internal type NOT to be exposed via API
 */
export type GroupInternal = PersistedEntityInternal & {

	name: string;
	owner: UserInternal | string;
	category: CategoryInternal | string;
}
