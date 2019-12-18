import { CategoryInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { UserInternal } from 'app/data/models/internal/user';

/**
 * Util type to extract common fields to both media item entities and catalog entries
 */
type CoreMediaItemDataInternal = {

	name: string;
	genres?: string[];
	description?: string;
	releaseDate?: Date;
	imageUrl?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MediaItemInternal = PersistedEntityInternal & CoreMediaItemDataInternal & {

	category: CategoryInternal | string;
	group?: GroupInternal | string;
	orderInGroup?: number;
	ownPlatform?: OwnPlatformInternal | string;
	owner: UserInternal | string;
	importance: number;
	userComment?: string;
	completedOn?: Date[];
	active?: boolean;
	markedAsRedo?: boolean;
	catalogId?: string;
};

/**
 * Media items groups filtering options, internal type NOT to be exposed via API
 */
export type MediaItemGroupFilterInternal = {
	
	anyGroup?: boolean;
	noGroup?: boolean;
	groupIds?: string[];
}

/**
 * Media items own platforms filtering options, internal type NOT to be exposed via API
 */
export type MediaItemOwnPlatformFilterInternal = {
	
	anyOwnPlatform?: boolean;
	noOwnPlatform?: boolean;
	ownPlatformIds?: string[];
}

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MediaItemFilterInternal = {
	
	importanceLevels?: number[];
	groups?: MediaItemGroupFilterInternal;
	ownPlatforms?: MediaItemOwnPlatformFilterInternal;
	complete?: boolean;
	name?: string;
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type MediaItemSortFieldInternal = 'IMPORTANCE' | 'NAME' | 'GROUP' | 'OWN_PLATFORM';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MediaItemSortByInternal = {

	ascending: boolean;
}

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMediaItemInternal = CoreMediaItemDataInternal & {

};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMediaItemCatalogResultInternal = {

	catalogId: string;
	name: string;
	releaseDate?: Date;
}

