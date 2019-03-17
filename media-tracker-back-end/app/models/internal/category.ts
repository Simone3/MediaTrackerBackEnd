import { UserInternal } from "./user";

/**
 * Model for a category, internal type NOT to be exposed via API
 */
export type CategoryInternal = {

	_id: any;
	name: string;
	owner: UserInternal | string;
}