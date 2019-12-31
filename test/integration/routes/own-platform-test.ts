import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, DeleteOwnPlatformResponse, FilterOwnPlatformsRequest, FilterOwnPlatformsResponse, GetAllOwnPlatformsResponse, IdentifiedOwnPlatform, MergeOwnPlatformsRequest, MergeOwnPlatformsResponse, UpdateOwnPlatformRequest, UpdateOwnPlatformResponse } from 'app/data/models/api/own-platform';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestOwnPlatform, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the own platforms API
 */
describe('OwnPlatform API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('OwnPlatform API Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };
		const secondUC: TestUC = { user: '', category: '' };

		// Create new users/categories for each test
		beforeEach(async() => {

			await initTestUCHelper('MOVIE', firstUC, 'First');
			await initTestUCHelper('MOVIE', secondUC, 'Second');
		});

		it('Should create a new own platform', async() => {

			const name = randomName();
			const color = '#0000FF';
			const icon = 'theicon';

			const response = await callHelper<AddOwnPlatformRequest, AddOwnPlatformResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user, {
				newOwnPlatform: {
					name: name,
					color: color,
					icon: icon
				}
			});
			
			const ownPlatformId: string = response.uid;
			expect(ownPlatformId, 'API did not return a UID').not.to.be.undefined;
			
			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(foundOwnPlatform.name, 'GetOwnPlatform returned the wrong name').to.equal(name);
			expect(foundOwnPlatform.color, 'GetOwnPlatform returned the wrong color').to.equal(color);
			expect(foundOwnPlatform.icon, 'GetOwnPlatform returned the wrong icon').to.equal(icon);
		});

		it('Should update an existing own platform', async() => {

			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const ownPlatformId = String(ownPlatform._id);
			const newName = randomName('Changed');
			const color = '#0000FF';
			const icon = 'theicon';

			await callHelper<UpdateOwnPlatformRequest, UpdateOwnPlatformResponse>('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/${ownPlatformId}`, firstUC.user, {
				ownPlatform: {
					name: newName,
					color: color,
					icon: icon
				}
			});
			
			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(foundOwnPlatform.name, 'GetOwnPlatform returned the wrong name').to.equal(newName);
		});

		it('Should merge two existing own platforms', async() => {

			const { _id: ownPlatformId1 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const { _id: ownPlatformId2 } = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));

			const mergedName = randomName('TheMergedName');
			const color = '#0000FF';
			const icon = 'theicon';

			await callHelper<MergeOwnPlatformsRequest, MergeOwnPlatformsResponse>('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/merge`, firstUC.user, {
				ownPlatformIds: [ ownPlatformId1, ownPlatformId2 ],
				mergedOwnPlatform: {
					name: mergedName,
					color: color,
					icon: icon
				}
			});
			
			const foundOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(firstUC.user, firstUC.category);
			expect(foundOwnPlatforms, 'GetOwnPlatform returned the wrong number of results').to.have.lengthOf(1);
			expect(foundOwnPlatforms[0].name, 'GetOwnPlatform returned the wrong name').to.equal(mergedName);
		});

		it('Should return all user own platforms', async() => {

			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Rrr'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Bbb'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Zzz'));
			
			const response = await callHelper<{}, GetAllOwnPlatformsResponse>('GET', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user);
			expect(response.ownPlatforms, 'API did not return the correct number of own platforms').to.have.lengthOf(3);
			expect(extract(response.ownPlatforms, 'name'), 'API did not return the correct own platforms').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should return all user own platforms that match the filter', async() => {

			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Rrr'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Bbb'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Zzz'));
			
			const response = await callHelper<FilterOwnPlatformsRequest, FilterOwnPlatformsResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/filter`, firstUC.user, {
				filter: {
					name: 'bbB'
				}
			});
			expect(response.ownPlatforms, 'API did not return the correct number of own platforms').to.have.lengthOf(1);
			expect(extract(response.ownPlatforms, 'name'), 'API did not return the correct own platforms').to.eql([ 'Bbb' ]);
		});

		it('Should delete an existing own platform', async() => {

			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const ownPlatformId = String(ownPlatform._id);

			await callHelper<{}, DeleteOwnPlatformResponse>('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/${ownPlatformId}`, firstUC.user);
			
			const foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper<{}, AddOwnPlatformResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user, {
				newOwnPlatform: {
					color: '#0000FF',
					icon: 'something'
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should check for color validity', async() => {

			await callHelper<{}, AddOwnPlatformResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user, {
				newOwnPlatform: {
					name: randomName(),
					color: 'sdfdcxcvxcvxcv',
					icon: 'something'
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should save and then retrieve ALL fields', async() => {

			const sourcePlatform: Required<IdentifiedOwnPlatform> = {
				uid: '',
				name: randomName(),
				color: '#00ff00',
				icon: 'theicon'
			};

			await callHelper<AddOwnPlatformRequest, AddOwnPlatformResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user, {
				newOwnPlatform: sourcePlatform
			});

			const response = await callHelper<{}, GetAllOwnPlatformsResponse>('GET', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, firstUC.user);
			
			sourcePlatform.uid = response.ownPlatforms[0].uid;
			expect(response.ownPlatforms[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourcePlatform);
		});

		it('Should not allow to add to another user\'s own platforms', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s own platform', async() => {

			await callHelper('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/someobjectid`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to merge another user\'s own platforms', async() => {

			await callHelper('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/merge`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s own platform', async() => {

			await callHelper('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/someobjectid`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s own platforms', async() => {

			await callHelper('GET', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s own platforms', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/filter`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
