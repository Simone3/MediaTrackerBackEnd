import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { userController } from 'app/controllers/entities/user';
import { CategoryInternal } from 'app/models/internal/category';
import { GroupInternal } from 'app/models/internal/group';
import { MovieInternal } from 'app/models/internal/media-items/movie';
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
export const getTestCategory = (_id: unknown, data: TestU, name?: string): CategoryInternal => {
			
	return {
		_id: _id,
		mediaType: 'MOVIE',
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
 * Helper to build a test movie (in a group)
 */
export const getTestMovieInGroup = (_id: unknown, data: TestUCG, orderInGroup: number, name?: string, importance?: number): MovieInternal => {
		
	if(!data.user || !data.category) {
		throw 'Invalid test entity builder input';
	}

	const result: MovieInternal = {
		_id: _id,
		owner: data.user,
		category: data.category,
		name: name ? name : randomName(),
		importance: importance ? importance : 10
	};

	if(data.group) {

		result.group = data.group;
		result.orderInGroup = orderInGroup;
	}
	
	return result;
};

/**
 * Helper to build a test movie
 */
export const getTestMovie = (_id: unknown, data: TestUC, name?: string, importance?: number): MovieInternal => {
		
	return getTestMovieInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, name, importance);
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
export const initTestUCHelper = async(target: TestUC, namePrefix: string): Promise<void> => {

	const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
	target.user = insertedUser._id;
	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, target, randomName(`${namePrefix}Category`)));
	target.category = insertedCategory._id;
};
	
/**
 * Calls the entity controllers to save a user, a category and a group
 */
export const initTestUCGHelper = async(target: TestUCG, namePrefix: string, user?: string): Promise<void> => {

	if(user) {

		target.user = user;
	}
	else {

		const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
		target.user = insertedUser._id;
	}

	const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, target, randomName(`${namePrefix}Category`)));
	target.category = insertedCategory._id;
	
	const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, target, randomName(`${namePrefix}Group`)));
	target.group = insertedGroup._id;
};

