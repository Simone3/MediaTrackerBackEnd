import { CategoryInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';

/**
 * Model for a group, internal type NOT to be exposed via API
 */
export type GroupInternal = PersistedEntityInternal & {

	name: string;
	owner: string;
	category: CategoryInternal | string;
}

/**
 * Group filtering options, internal type NOT to be exposed via API
 */
export type GroupFilterInternal = {

	name?: string;
}
