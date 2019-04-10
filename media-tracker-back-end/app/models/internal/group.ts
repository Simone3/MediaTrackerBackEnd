import { UserInternal } from "./user";
import { PersistedEntityInternal } from "./common";
import { CategoryInternal } from "./category";

/**
 * Model for a group, internal type NOT to be exposed via API
 */
export type GroupInternal = PersistedEntityInternal & {

	name: string;
	owner: UserInternal | string;
	category: CategoryInternal | string;
}