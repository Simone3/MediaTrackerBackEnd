import { PersistedEntityInternal } from 'app/data/models/internal/common';

/**
 * Model for a user, internal type NOT to be exposed via API
 */
export type UserInternal = PersistedEntityInternal & {

	name: string;
}
