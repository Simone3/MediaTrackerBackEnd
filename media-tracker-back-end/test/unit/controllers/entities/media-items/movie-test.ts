import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { userController } from 'app/controllers/entities/user';
import { MovieInternal } from 'app/models/internal/media-items/movie';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, getTestGroup, getTestMovie, getTestMovieInGroup, getTestUser, TestUCG } from 'helpers/entities-builder-helper';
import { extractName, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the movie controller
 */
describe('MovieController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('MovieController Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };
		const secondUCG: TestUCG = { user: '', category: '' };
		const thirdUCG: TestUCG = { user: '', category: '' };
		
		const initTestUCGHelper = async(target: TestUCG, namePrefix: string, user?: string): Promise<void> => {

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

		const helperCompareResults = (expected: string[], result: MovieInternal[], matchInOrder?: boolean): void => {

			expect(result, 'helperCompareResults - Number of results does not match').to.have.lengthOf(expected.length);
			
			if(matchInOrder) {

				expect(result.map(extractName), 'helperCompareResults - Ordered results do not match').to.eql(expected);
			}
			else {

				expect(result.map(extractName), 'helperCompareResults - Unordered results do not match').to.have.members(expected);
			}
		};

		// Create new users, categories and groups for each test
		beforeEach(async() => {

			await initTestUCGHelper(firstUCG, 'First');
			await initTestUCGHelper(secondUCG, 'Second');
			await initTestUCGHelper(thirdUCG, 'Third', firstUCG.user);
		});

		it('GetMediaItem should return the correct movie after SaveMediaItem', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const insertedId = insertedMovie._id;
			expect(insertedMovie._id, 'SaveMediaItem (insert) returned empty ID').to.exist;

			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, insertedId);
			expect(foundMovie, 'GetMediaItem returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(String(foundMovie._id), 'GetMediaItem returned wrong ID').to.equal(String(insertedId));
		});

		it('GetMediaItem should only get a movie for the current user', async() => {

			let insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const firstId = insertedMovie._id;
			insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG));

			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, firstId);
			expect(foundMovie, 'GetMediaItem returned an undefined result').not.to.be.undefined;

			foundMovie = await movieEntityController.getMediaItem(secondUCG.user, firstUCG.category, firstId);
			expect(foundMovie, 'GetMediaItem returned an defined result').to.be.undefined;
		});

		it('GetMediaItem should only get a movie for the current category', async() => {

			let insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const firstId = insertedMovie._id;
			insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG));

			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, firstId);
			expect(foundMovie, 'GetMediaItem returned an undefined result').not.to.be.undefined;

			foundMovie = await movieEntityController.getMediaItem(firstUCG.user, secondUCG.user, firstId);
			expect(foundMovie, 'GetMediaItem returned an defined result').to.be.undefined;
		});

		it('GetMediaItem should return the correct movie after two SaveMediaItem (insert and update)', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const insertedId = insertedMovie._id;

			const newName = randomName('Changed');
			await movieEntityController.saveMediaItem(getTestMovie(insertedId, firstUCG, newName));

			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, insertedId);
			expect(foundMovie, 'GetMediaItem returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(String(foundMovie._id), 'GetMediaItem returned wrong ID').to.equal(String(insertedId));
			expect(foundMovie.name, 'GetMediaItem returned wrong name').to.equal(newName);
		});

		it('FilterAndOrder should return the correct results', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Ttt'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, 'Aaa'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Bbb', 123));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Zzz'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, 'Ddd', 123));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Ccc'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, thirdUCG, 'Mmm'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, thirdUCG, 'Nnn'));

			helperCompareResults([ 'Bbb' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, {
				importance: 123
			}), true);

			helperCompareResults([ 'Bbb', 'Ccc', 'Ttt', 'Zzz' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, undefined, [{
				field: 'NAME',
				ascending: true
			}]), true);

			helperCompareResults([ 'Zzz', 'Ttt', 'Ccc', 'Bbb' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, undefined, [{
				field: 'NAME',
				ascending: false
			}]), true);

			helperCompareResults([], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, {
				importance: 65465321
			}), true);
		});

		it('SearchMediaIterm should return the correct results', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'SomeRandomString'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'ThisIsTheMediaItemName'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'SomeOtherRandomString'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, 'SomeOtherRandomString'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'AnotherMediaItem', 345));

			helperCompareResults([ 'SomeOtherRandomString', 'AnotherMediaItem' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'other'));

			helperCompareResults([ 'AnotherMediaItem' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'other', {
				importance: 345
			}));

			helperCompareResults([], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'wontfind'));

			helperCompareResults([], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, '.*'));
			
			helperCompareResults([ 'SomeRandomString' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'somerand'));
		});

		it('FilterAndOrder should filter by group', async() => {

			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 2, 'Aaa'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Bbb', 345));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 1, 'Ccc'));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 3, 'Ddd', 345));

			helperCompareResults([ 'Ccc', 'Aaa', 'Ddd' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, {
				groupId: firstUCG.group
			}, [{
				field: 'GROUP',
				ascending: true
			}]), true);
		});

		it('SaveMediaItem (insert) should not accept an invalid user', async() => {

			try {

				await movieEntityController.saveMediaItem(getTestMovie(undefined, {
					user: '5cbf26ea895c281b54b6737f',
					category: firstUCG.category
				}));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (update) should not accept an invalid user', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const insertedId = insertedMovie._id;

			try {

				await movieEntityController.saveMediaItem(getTestMovie(insertedId, {
					user: '5cbf26ea895c281b54b6737f',
					category: firstUCG.category
				}));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (insert) should not accept an invalid category', async() => {

			try {

				await movieEntityController.saveMediaItem(getTestMovie(undefined, {
					user: firstUCG.user,
					category: '5cbf26ea895c281b54b6737f'
				}));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (update) should not accept an invalid category', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const insertedId = insertedMovie._id;

			try {

				await movieEntityController.saveMediaItem(getTestMovie(insertedId, {
					user: firstUCG.user,
					category: '5cbf26ea895c281b54b6737f'
				}));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});
		
		it('SaveMediaItem (insert) should not accept an invalid group', async() => {

			try {

				await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, {
					user: firstUCG.user,
					category: firstUCG.category,
					group: '5cbf26ea895c281b54b6737f'
				}, 5));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (update) should not accept an invalid group', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 5));
			const insertedId = insertedMovie._id;

			try {

				await movieEntityController.saveMediaItem(getTestMovieInGroup(insertedId, {
					user: firstUCG.user,
					category: firstUCG.category,
					group: '5cbf26ea895c281b54b6737f'
				}, 5));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('GetMediaItem after DeleteMediaItem should return undefined', async() => {
			
			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId = movie._id;

			await movieEntityController.deleteMediaItem(firstUCG.user, firstUCG.category, movieId);

			const foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMediaItem returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its movies', async function() {

			this.timeout(4000);

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));

			await userController.deleteUser(firstUCG.user, true);

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'FilterAndOrder did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

