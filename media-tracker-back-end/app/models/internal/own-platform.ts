import { CategoryInternal } from 'app/models/internal/category';
import { PersistedEntityInternal } from 'app/models/internal/common';
import { UserInternal } from 'app/models/internal/user';

/**
 * Model for a a platform where some user owns some media items, internal type NOT to be exposed via API
 */
export type OwnPlatformInternal = PersistedEntityInternal & {

	name: string;
	color: string;
	owner: UserInternal | string;
	category: CategoryInternal | string;
}
