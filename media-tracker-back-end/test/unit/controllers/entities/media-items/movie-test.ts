import { categoryController } from 'app/controllers/entities/category';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { userController } from 'app/controllers/entities/user';
import { GroupInternal } from 'app/models/internal/group';
import { MovieInternal } from 'app/models/internal/media-items/movie';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestMovie, getTestMovieInGroup, getTestOwnPlatform, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { extract, randomName } from 'helpers/test-misc-helper';

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
		const wrongMediaUCG: TestUCG = { user: '', category: '' };

		const helperCompareResults = (expected: string[], result: MovieInternal[], matchInOrder?: boolean): void => {

			expect(result, 'helperCompareResults - Number of results does not match').to.have.lengthOf(expected.length);
			
			if(matchInOrder) {

				expect(extract(result, 'name'), 'helperCompareResults - Ordered results do not match').to.eql(expected);
			}
			else {

				expect(extract(result, 'name'), 'helperCompareResults - Unordered results do not match').to.have.members(expected);
			}
		};

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('MOVIE', firstUCG, 'First');
			await initTestUCGHelper('MOVIE', secondUCG, 'Second');
			await initTestUCGHelper('MOVIE', thirdUCG, 'Third', firstUCG.user);
			await initTestUCGHelper('BOOK', wrongMediaUCG, 'WrongMediaType');
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
			await movieEntityController.saveMediaItem(getTestMovie(insertedId, firstUCG, { name: newName }));

			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, insertedId);
			expect(foundMovie, 'GetMediaItem returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(String(foundMovie._id), 'GetMediaItem returned wrong ID').to.equal(String(insertedId));
			expect(foundMovie.name, 'GetMediaItem returned wrong name').to.equal(newName);
		});

		it('FilterAndOrder should return the correct results', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ttt' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, { name: 'Aaa' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: 123 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Zzz' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, { name: 'Ddd', importance: 123 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ccc' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, thirdUCG, { name: 'Mmm' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, thirdUCG, { name: 'Nnn' }));

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

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'SomeRandomString' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'ThisIsTheMediaItemName' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'SomeOtherRandomString' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, { name: 'SomeOtherRandomString' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'AnotherMediaItem', importance: 345 }));

			helperCompareResults([ 'SomeOtherRandomString', 'AnotherMediaItem' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'other'));

			helperCompareResults([ 'AnotherMediaItem' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'other', {
				importance: 345
			}));

			helperCompareResults([], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'wontfind'));

			helperCompareResults([], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, '.*'));
			
			helperCompareResults([ 'SomeRandomString' ], await movieEntityController.searchMediaItems(firstUCG.user, firstUCG.category, 'somerand'));
		});
		
		it('FilterAndOrder result should contain group data', async() => {

			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 2, { name: 'Aaa' }));

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'GetMediaItem returned the wrong number of results').to.have.lengthOf(1);
			expect(foundMovies[0].group, 'GetMediaItem returned an undefined group').not.to.be.undefined;
			const groupData = foundMovies[0].group as GroupInternal;
			expect(String(groupData._id), 'GetMediaItem returned an invalid group ID').to.equal(String(firstUCG.group));
			expect(groupData.name, 'GetMediaItem returned an invalid group name').not.to.be.undefined;
		});

		it('FilterAndOrder should filter by group', async() => {

			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 2, { name: 'Aaa' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: 345 }));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 1, { name: 'Ccc' }));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 3, { name: 'Ddd', importance: 345 }));

			helperCompareResults([ 'Ccc', 'Aaa', 'Ddd' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, {
				groupId: firstUCG.group
			}, [{
				field: 'GROUP',
				ascending: true
			}]), true);
		});
		
		it('FilterAndOrder result should contain platform data', async() => {

			const ownPlatformName = randomName('SomeOwnPlatform');
			const { _id: ownPlatformId } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG, ownPlatformName));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId }));

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'GetMediaItem returned the wrong number of results').to.have.lengthOf(1);
			expect(foundMovies[0].ownPlatform, 'GetMediaItem returned an undefined own platform').not.to.be.undefined;
			const ownPlatformData = foundMovies[0].ownPlatform as OwnPlatformInternal;
			expect(String(ownPlatformData._id), 'GetMediaItem returned an invalid own platform ID').to.equal(String(ownPlatformId));
			expect(ownPlatformData.name, 'GetMediaItem returned an invalid own platform name').to.equal(ownPlatformName);
		});

		it('FilterAndOrder should filter by own platform', async() => {

			const { _id: ownPlatformId1 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));
			const { _id: ownPlatformId2 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Aaa', ownPlatform: ownPlatformId1 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: 345 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ccc', ownPlatform: ownPlatformId1 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ddd', importance: 345, ownPlatform: ownPlatformId2 }));

			helperCompareResults([ 'Aaa', 'Ccc' ], await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category, {
				ownPlatformId: ownPlatformId1
			}));
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
		
		it('SaveMediaItem (insert) should not accept an invalid own platform', async() => {

			try {

				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (update) should not accept an invalid own platform', async() => {

			const insertedMovie = await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 5));
			const insertedId = insertedMovie._id;

			try {

				await movieEntityController.saveMediaItem(getTestMovie(insertedId, firstUCG, { ownPlatform: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (insert) should not allow a category with wrong media type', async() => {

			try {
				
				await movieEntityController.saveMediaItem(getTestMovie(undefined, wrongMediaUCG));
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

		it('Deleting a category should also delete all its media items', async function() {
			
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));

			await categoryController.deleteCategory(firstUCG.user, firstUCG.category, true);

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'FilterAndOrder did not return the correct number of results').to.have.lengthOf(0);
		});

		it('Deleting an own platform should also remove it in all media items', async function() {
			
			const { _id: ownPlatformId1 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));
			const { _id: ownPlatformId2 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId1 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId2 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId1 }));

			await ownPlatformController.deleteOwnPlatform(firstUCG.user, firstUCG.category, ownPlatformId1);

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'FilterAndOrder did not return the correct number of results').to.have.lengthOf(3);
			const ownPlatforms: (OwnPlatformInternal | undefined)[] = extract(foundMovies, 'ownPlatform');
			expect(ownPlatforms.filter((value) => !value)).to.have.lengthOf(2);
			expect(ownPlatforms.filter((value) => value)).to.have.lengthOf(1);
			const otherPlatform = ownPlatforms.filter((value) => value)[0] as OwnPlatformInternal;
			expect(String(otherPlatform._id)).to.equal(String(ownPlatformId2));
		});

		it('Merging an own platforms should also replace them in all media items', async function() {
			
			const { _id: ownPlatformId1 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));
			const { _id: ownPlatformId2 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId1 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId2 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: undefined }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { ownPlatform: ownPlatformId1 }));

			const mergedName = randomName('TheMergedName');
			await ownPlatformController.mergeOwnPlatforms([ ownPlatformId1, ownPlatformId2 ], getTestOwnPlatform(undefined, firstUCG, mergedName));

			const foundMovies = await movieEntityController.filterAndOrderMediaItems(firstUCG.user, firstUCG.category);
			expect(foundMovies, 'FilterAndOrder did not return the correct number of results').to.have.lengthOf(4);
			const ownPlatforms: (OwnPlatformInternal | undefined)[] = extract(foundMovies, 'ownPlatform');
			expect(ownPlatforms.filter((value) => !value)).to.have.lengthOf(1);
			const definedPlatforms = ownPlatforms.filter((value) => value);
			expect(definedPlatforms).to.have.lengthOf(3);
			expect(extract(definedPlatforms as OwnPlatformInternal[], 'name')).to.eql([ mergedName, mergedName, mergedName ]);
		});
	});
});

