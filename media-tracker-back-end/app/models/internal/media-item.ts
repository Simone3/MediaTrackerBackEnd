import { CategoryInternal } from "./category";
import { UserInternal } from "./user";

/**
 * Model for a media item, internal type NOT to be exposed via API
 */
export type MediaItemInternal = {

	_id: any,
	name: string;
	author?: string;
	owner: UserInternal | string;
	category: CategoryInternal | string;
};