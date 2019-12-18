import { bookEntityController } from 'app/controllers/entities/media-items/book';
import { IdentifiedGroup } from 'app/data/models/api/group';
import { CatalogBook, IdentifiedBook } from 'app/data/models/api/media-items/book';
import { IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestBook, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';
import { setupBookExternalServicesMocks } from 'mocks/external-services-mocks';

const expect = chai.expect;

/**
 * Tests for the book API
 */
describe('Book API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();
	setupBookExternalServicesMocks();

	describe('Book API Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('BOOK', firstUCG, 'First');
		});

		it('Should create a new book', async() => {

			const name = randomName();
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books`, {
				newBook: {
					name: name,
					importance: 10
				}
			});
			
			const bookId: string = response.uid;
			expect(bookId, 'API did not return a UID').not.to.be.undefined;
			
			let foundBook = await bookEntityController.getMediaItem(firstUCG.user, firstUCG.category, bookId);
			expect(foundBook, 'GetBook returned an undefined result').not.to.be.undefined;
			foundBook = foundBook as BookInternal;
			expect(foundBook.name, 'GetBook returned the wrong name').to.equal(name);
		});

		it('Should update an existing book', async() => {

			const book = await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG));
			const bookId = String(book._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/books/${bookId}`, {
				book: {
					name: newName,
					importance: 10
				}
			});
			
			let foundBook = await bookEntityController.getMediaItem(firstUCG.user, firstUCG.category, bookId);
			expect(foundBook, 'GetBook returned an undefined result').not.to.be.undefined;
			foundBook = foundBook as BookInternal;
			expect(foundBook.name, 'GetBook returned the wrong name').to.equal(newName);
		});

		it('Should filter and sort books', async() => {

			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Rrr', importance: 100 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Zzz', importance: 85 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Aaa', importance: 85 }));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books/filter`, {
				filter: {
					importanceLevels: [ 85 ]
				},
				sortBy: [{
					field: 'NAME',
					ascending: false
				}]
			});
			expect(response.books, 'API did not return the correct number of books').to.have.lengthOf(3);
			expect(extract(response.books, 'name'), 'API did not return the correct books').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search books by term', async() => {

			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Rtestrr', importance: 100 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'ZzTESTz', importance: 85 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG, { name: 'testAaa', importance: 85 }));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books/search`, {
				filter: {
					importanceLevels: [ 85 ]
				},
				searchTerm: 'test'
			});
			expect(response.books, 'API did not return the correct number of books').to.have.lengthOf(2);
			expect(extract(response.books, 'name'), 'API did not return the correct books').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing book', async() => {

			const book = await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG));
			const bookId = String(book._id);

			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/books/${bookId}`);
			
			const foundBook = await bookEntityController.getMediaItem(firstUCG.user, firstUCG.category, bookId);
			expect(foundBook, 'GetBook returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books`, {
				newBook: {
					importance: 10
				}
			}, 500);
		});

		it('Should check for importance validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books`, {
				newBook: {
					name: randomName()
				}
			}, 500);
		});

		it('Should search the books catalog', async() => {

			const response = await callHelper('GET', `/catalog/books/search/Mock Book`);
			
			expect(response.searchResults, 'API did not return the correct number of catalog books').to.have.lengthOf(2);
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog books').to.have.members([ 'Mock Book 1', 'Mock Book 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog books').to.have.members([ '123', '456' ]);
		});

		it('Should get book details from the catalog', async() => {

			const expectedResult: Required<CatalogBook> = {
				name: 'Mock Book 1',
				authors: [ 'Some Author' ],
				description: 'This is some description.',
				genres: [ 'Genre1', 'Genre2', 'Genre3' ],
				imageUrl: 'http://books.google.com/books/content?id=YTqqPwAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72OZGhUPTW_1_RnTs98DY6qjQKQg0A_Fh_rT_JFmdA6roIHhLVbAKRSdEaXqaGMP-GYPNFbOl4l-sBEwj5_hz9zrdS-3u9A_Pp16jwYMENYJgcacJLp_Cr3ZwGxB3VFnngrShS_&source=gbs_api',
				pagesNumber: 513,
				releaseDate: '2002-01-01T00:00:00.000Z'
			};
			
			const response = await callHelper('GET', `/catalog/books/123`);

			expect(response.catalogBook, 'API did not return the correct catalog details').to.be.eql(expectedResult);
		});

		it('Should save and then retrieve ALL fields', async() => {

			// Add group
			const sourceGroup: Required<IdentifiedGroup> = {
				uid: '',
				name: randomName('Group')
			};
			const { uid: groupId } = await await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/groups`, {
				newGroup: sourceGroup
			});

			// Add own platform
			const sourceOwnPlatform: Required<IdentifiedOwnPlatform> = {
				uid: '',
				name: randomName('OwnPlatform'),
				color: '#00ff00',
				icon: 'something'
			};
			const { uid: ownPlatformId } = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/own-platforms`, {
				newOwnPlatform: sourceOwnPlatform
			});

			// Add media item
			const sourceBook: Required<IdentifiedBook> = {
				uid: '',
				name: randomName('Name'),
				active: true,
				markedAsRedo: true,
				catalogId: randomName('Catalog'),
				completedOn: [ '2011-12-25T10:32:27.240Z', '2015-04-01T10:32:27.240Z', '2017-05-17T10:32:27.240Z' ],
				description: randomName('Description'),
				genres: [ randomName('Genre1') ],
				group: {
					groupId: groupId,
					orderInGroup: 4
				},
				imageUrl: 'http://test.com',
				importance: 56,
				ownPlatform: {
					ownPlatformId: ownPlatformId
				},
				releaseDate: '2010-01-01T10:32:27.240Z',
				userComment: randomName('SomeComment'),
				authors: [ randomName('Author1'), randomName('Author2') ],
				pagesNumber: 123
			};
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/books`, {
				newBook: sourceBook
			});

			// Get media item
			const response = await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/books`);

			// "Fix" source entities
			sourceBook.uid = response.books[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceBook.group.groupData = sourceGroup;
			sourceBook.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.books[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceBook);
		});
	});
});
