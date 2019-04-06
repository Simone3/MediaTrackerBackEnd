import { UserInternal } from "./user";
import { PersistedEntityInternal } from "./common";

/**
 * Model for a category, internal type NOT to be exposed via API
 */
export type CategoryInternal = PersistedEntityInternal & {

	name: string;
	owner: UserInternal | string;
}