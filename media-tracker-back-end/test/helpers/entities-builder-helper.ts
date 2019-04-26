import { CategoryInternal } from 'app/models/internal/category';
import { GroupInternal } from 'app/models/internal/group';
import { MovieInternal } from 'app/models/internal/media-items/movie';
import { UserInternal } from 'app/models/internal/user';
import { randomName } from './test-misc-helper';

export type TestU = {
	user: string;
}

export type TestUC = TestU & {
	category: string;
};

export type TestUCG = TestUC & {
	group?: string;
};

export const getTestUser = (_id: unknown, name?: string): UserInternal => {
	
	return {
		_id: _id,
		name: name ? name : randomName()
	};
};

export const getTestCategory = (_id: unknown, data: TestU, name?: string): CategoryInternal => {
			
	return {
		_id: _id,
		mediaType: 'MOVIE',
		owner: data.user,
		name: name ? name : randomName()
	};
};

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

export const getTestMovie = (_id: unknown, data: TestUC, name?: string, importance?: number): MovieInternal => {
		
	return getTestMovieInGroup(_id, {
		user: data.user,
		category: data.category
	}, 0, name, importance);
};

