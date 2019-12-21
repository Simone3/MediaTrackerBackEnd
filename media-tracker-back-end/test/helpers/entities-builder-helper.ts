import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { randomName } from 'test/helpers/test-misc-helper';

export type TestU = {
	user: string;
}

export type TestUC = TestU & {
	category: string;
};

export type TestUCG = TestUC & {
	group?: string;
};

export type TestP = {
	ownPlatform: string;
};

/**
 * Helper to build a test category
 * @param _id the ID (undefined means a new entity)
 * @param mediaType the category media type
 * @param data the required data for primary key
 * @param name the optional name, defaults to a random string
 * @returns a test category entity
 */
export const getTestCategory = (_id: unknown, mediaType: MediaTypeInternal, data: TestU, name?: string): CategoryInternal => {
			
	return {
		_id: _id,
		mediaType: mediaType,
		owner: data.user,
		name: name ? name : randomName(),
		color: '#0000FF'
	};
};

/**
 * Helper to build a test group
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param name the optional name, defaults to a random string
 * @returns a test group entity
 */
export const getTestGroup = (_id: unknown, data: TestUC, name?: string): GroupInternal => {
	
	if(!data.user || !data.category) {
		throw 'Invalid test entity builder input';
	}

	return {
		_id: _id,
		owner: data.user,
		category: data.category,
		name: name ? name : randomName()
	};
};

/**
 * Helper to build a test own platform
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param name the optional name, defaults to a random string
 * @returns a test own platform entity
 */
export const getTestOwnPlatform = (_id: unknown, data: TestUC, name?: string): OwnPlatformInternal => {
	
	if(!data.user || !data.category) {
		throw 'Invalid test entity builder input';
	}

	return {
		_id: _id,
		owner: data.user,
		category: data.category,
		icon: 'something',
		name: name ? name : randomName(),
		color: '#0000FF'
	};
};

/**
 * Helper type for media item extra test data
 */
type OptionalMediaItemTestData = {
	name?: string;
	importance?: number;
	ownPlatform?: string;
	releaseDate?: Date;
	completedOn?: Date[];
	active?: boolean;
	markedAsRedo?: boolean;
}

/**
 * Helper to build a generic media item
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param orderInGroup the media item order in its group
 * @param optionalData some optional date to build the entity
 * @returns a generic media item test entity
 */
const getTestMediaItem = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): MediaItemInternal => {
		
	if(!data.user || !data.category) {
		throw 'Invalid test entity builder input';
	}

	const result: MediaItemInternal = {
		_id: _id,
		owner: data.user,
		category: data.category,
		name: optionalData && optionalData.name ? optionalData.name : randomName(),
		importance: optionalData && optionalData.importance ? optionalData.importance : 10,
		ownPlatform: optionalData && optionalData.ownPlatform ? optionalData.ownPlatform : undefined,
		completedOn: optionalData ? optionalData.completedOn : undefined,
		releaseDate: optionalData ? optionalData.releaseDate : undefined,
		active: optionalData?.active,
		markedAsRedo: optionalData?.markedAsRedo
	};

	if(data.group) {

		result.group = data.group;
		result.orderInGroup = orderInGroup;
	}
	
	return result;
};

/**
 * Helper to build a test movie (in a group)
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param orderInGroup the media item order in its group
 * @param optionalData some optional date to build the entity
 * @returns a test movie entity
 */
export const getTestMovieInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): MovieInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test movie
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param optionalData some optional date to build the entity
 * @returns a test movie entity
 */
export const getTestMovie = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): MovieInternal => {
		
	return getTestMovieInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test videogame (in a group)
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param orderInGroup the media item order in its group
 * @param optionalData some optional date to build the entity
 * @returns a test videogame entity
 */
export const getTestVideogameInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): VideogameInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test videogame
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param optionalData some optional date to build the entity
 * @returns a test videogame entity
 */
export const getTestVideogame = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): VideogameInternal => {
		
	return getTestVideogameInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test tvShow (in a group)
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param orderInGroup the media item order in its group
 * @param optionalData some optional date to build the entity
 * @returns a test TV show entity
 */
export const getTestTvShowInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): TvShowInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test tvShow
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param optionalData some optional date to build the entity
 * @returns a test TV show entity
 */
export const getTestTvShow = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): TvShowInternal => {
		
	return getTestTvShowInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test book (in a group)
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param orderInGroup the media item order in its group
 * @param optionalData some optional date to build the entity
 * @returns a test book entity
 */
export const getTestBookInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): BookInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test book
 * @param _id the ID (undefined means a new entity)
 * @param data the required data for primary key
 * @param optionalData some optional date to build the entity
 * @returns a test book entity
 */
export const getTestBook = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): BookInternal => {
		
	return getTestBookInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Calls the entity controller to save a user
 * @param target the base source data
 * @param namePrefix the random name prefix
 * @returns a void promise that resolves when the entity is created
 */
export const initTestUHelper = async(target: TestU, namePrefix: string): Promise<void> => {

	target.user = randomName(`${namePrefix}User`);
};

/**
 * Calls the entity controllers to save a user and a category
 * @param categoryMediaType the media type of the category
 * @param target the base source data
 * @param namePrefix the random name prefix
 * @returns a void promise that resolves when the entity is created
 */
export const initTestUCHelper = async(categoryMediaType: MediaTypeInternal, target: TestUC, namePrefix: string): Promise<void> => {

	target.user = randomName(`${namePrefix}User`);
	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, categoryMediaType, target, randomName(`${namePrefix}Category`)));
	// eslint-disable-next-line require-atomic-updates
	target.category = insertedCategory._id;
};
	
/**
 * Calls the entity controllers to save a user, a category and a group
 * @param categoryMediaType the media type of the category
 * @param target the base source data
 * @param namePrefix the random name prefix
 * @param user the optional user that overwrites the "target" user
 * @returns a void promise that resolves when the entity is created
 */
export const initTestUCGHelper = async(categoryMediaType: MediaTypeInternal, target: TestUCG, namePrefix: string, user?: string): Promise<void> => {

	if(user) {

		target.user = user;
	}
	else {
		
		target.user = randomName(`${namePrefix}User`);
	}

	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, categoryMediaType, target, randomName(`${namePrefix}Category`)));
	// eslint-disable-next-line require-atomic-updates
	target.category = insertedCategory._id;
	
	const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, target, randomName(`${namePrefix}Group`)));
	// eslint-disable-next-line require-atomic-updates
	target.group = insertedGroup._id;
};

