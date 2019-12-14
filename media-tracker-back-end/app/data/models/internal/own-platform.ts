import { CategoryInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { UserInternal } from 'app/data/models/internal/user';

/**
 * Model for a a platform where some user owns some media items, internal type NOT to be exposed via API
 */
export type OwnPlatformInternal = PersistedEntityInternal & {

	name: string;
	color: string;
	owner: UserInternal | string;
	category: CategoryInternal | string;
}

/**
 * OwnPlatform filtering options, internal type NOT to be exposed via API
 */
export type OwnPlatformFilterInternal = {

	name?: string;
}
