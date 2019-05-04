import { bookEntityController } from 'app/controllers/entities/media-items/book';
import { BookInternal } from 'app/models/internal/media-items/book';
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
			const bookId: string = String(book._id);
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
					importance: 85
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
					importance: 85
				},
				searchTerm: 'test'
			});
			expect(response.books, 'API did not return the correct number of books').to.have.lengthOf(2);
			expect(extract(response.books, 'name'), 'API did not return the correct books').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing book', async() => {

			const book = await bookEntityController.saveMediaItem(getTestBook(undefined, firstUCG));
			const bookId: string = String(book._id);

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
			expect(extract(response.searchResults, 'title'), 'API did not return the correct catalog books').to.have.members([ 'Mock Book 1', 'Mock Book 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog books').to.have.members([ '123', '456' ]);
		});

		it('Should get book details from the catalog', async() => {

			const response = await callHelper('GET', `/catalog/books/123`);
			
			expect(response.catalogBook, 'API did not return a valid catalog details result').not.to.be.undefined;
			expect(response.catalogBook.name, 'API did not return a valid catalog details result').to.be.equal('Mock Book 1');
			expect(response.catalogBook.author, 'API did not return a valid catalog details result').to.be.equal('Some Author');
		});
	});
});
