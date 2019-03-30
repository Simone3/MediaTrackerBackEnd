import { CategoryInternal } from "./category";
import { UserInternal } from "./user";

/**
 * Model for a media item, internal type NOT to be exposed via API
 */
export type MediaItemInternal = {

	_id: any;
	owner: UserInternal | string;
	category: CategoryInternal | string;
	name: string;
	author?: string;
	importance: number;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MediaItemFilterInternal = {
	
	importance?: number;
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export enum MediaItemSortFieldInternal {

	IMPORTANCE,
	AUTHOR,
	NAME
}

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MediaItemSortByInternal = {

	field: MediaItemSortFieldInternal;
	ascending: boolean;
}

