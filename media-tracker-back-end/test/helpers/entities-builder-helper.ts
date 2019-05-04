import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { userController } from 'app/controllers/entities/user';
import { CategoryInternal, MediaTypeInternal } from 'app/models/internal/category';
import { GroupInternal } from 'app/models/internal/group';
import { BookInternal } from 'app/models/internal/media-items/book';
import { MediaItemInternal } from 'app/models/internal/media-items/media-item';
import { MovieInternal } from 'app/models/internal/media-items/movie';
import { TvShowInternal } from 'app/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/models/internal/media-items/videogame';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import { UserInternal } from 'app/models/internal/user';
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

/**
 * Helper to build a test users
 */
export const getTestUser = (_id: unknown, name?: string): UserInternal => {
	
	return {
		_id: _id,
		name: name ? name : randomName()
	};
};

/**
 * Helper to build a test category
 */
export const getTestCategory = (_id: unknown, mediaType: MediaTypeInternal, data: TestU, name?: string): CategoryInternal => {
			
	return {
		_id: _id,
		mediaType: mediaType,
		owner: data.user,
		name: name ? name : randomName()
	};
};

/**
 * Helper to build a test group
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
 */
export const getTestOwnPlatform = (_id: unknown, data: TestUC, name?: string): OwnPlatformInternal => {
	
	if(!data.user || !data.category) {
		throw 'Invalid test entity builder input';
	}

	return {
		_id: _id,
		owner: data.user,
		category: data.category,
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
}

/**
 * Helper to build a generic media item
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
		importance: optionalData && optionalData.importance ? optionalData.importance : 10
	};

	if(data.group) {

		result.group = data.group;
		result.orderInGroup = orderInGroup;
	}
	
	return result;
};

/**
 * Helper to build a test movie (in a group)
 */
export const getTestMovieInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): MovieInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test movie
 */
export const getTestMovie = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): MovieInternal => {
		
	return getTestMovieInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test videogame (in a group)
 */
export const getTestVideogameInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): VideogameInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test videogame
 */
export const getTestVideogame = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): VideogameInternal => {
		
	return getTestVideogameInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test tvShow (in a group)
 */
export const getTestTvShowInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): TvShowInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test tvShow
 */
export const getTestTvShow = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): TvShowInternal => {
		
	return getTestTvShowInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Helper to build a test book (in a group)
 */
export const getTestBookInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, optionalData?: OptionalMediaItemTestData): BookInternal => {
		
	return getTestMediaItem(_id, data, orderInGroup, optionalData);
};

/**
 * Helper to build a test book
 */
export const getTestBook = (_id: unknown, data: TestUC, optionalData?: OptionalMediaItemTestData): BookInternal => {
		
	return getTestBookInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, optionalData);
};

/**
 * Calls the entity controller to save a user
 */
export const initTestUHelper = async(target: TestU, namePrefix: string): Promise<void> => {

	const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
	target.user = insertedUser._id;
};

/**
 * Calls the entity controllers to save a user and a category
 */
export const initTestUCHelper = async(categoryMediaType: MediaTypeInternal, target: TestUC, namePrefix: string): Promise<void> => {

	const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
	target.user = insertedUser._id;
	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, categoryMediaType, target, randomName(`${namePrefix}Category`)));
	target.category = insertedCategory._id;
};
	
/**
 * Calls the entity controllers to save a user, a category and a group
 */
export const initTestUCGHelper = async(categoryMediaType: MediaTypeInternal, target: TestUCG, namePrefix: string, user?: string): Promise<void> => {

	if(user) {

		target.user = user;
	}
	else {

		const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
		target.user = insertedUser._id;
	}

	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, categoryMediaType, target, randomName(`${namePrefix}Category`)));
	target.category = insertedCategory._id;
	
	const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, target, randomName(`${namePrefix}Group`)));
	target.group = insertedGroup._id;
};

