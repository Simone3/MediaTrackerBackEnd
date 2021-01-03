import { tvShowEntityController } from 'app/controllers/entities/media-items/tv-show';
import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestTvShow, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { extract } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the tvShow controller
 */
describe('TvShowController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('TvShowController Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('TV_SHOW', firstUCG, 'First');
		});

		const helperCompareSeasons = (expected: TvShowSeasonInternal[] | undefined, result: TvShowSeasonInternal[] | undefined): void => {

			expected = expected ? expected : [];
			result = result ? result : [];

			expect(result, 'helperCompareSeasons - Number of results does not match').to.have.lengthOf(expected.length);
			expect(extract(result, 'number'), 'helperCompareSeasons - Ordered results do not match').to.eql(extract(expected, 'number'));
			expect(extract(result, 'episodesNumber'), 'helperCompareSeasons - Ordered results do not match').to.eql(extract(expected, 'episodesNumber'));
			expect(extract(result, 'watchedEpisodesNumber'), 'helperCompareSeasons - Ordered results do not match').to.eql(extract(expected, 'watchedEpisodesNumber'));
		};

		it('GetMediaItem should return the correct seasons (empty) after SaveMediaItem', async() => {

			const tvShow = getTestTvShow(undefined, firstUCG);
			tvShow.seasons = undefined;

			const insertedTvShow = await tvShowEntityController.saveMediaItem(tvShow);
			const insertedId = insertedTvShow._id;
			expect(insertedTvShow._id, 'SaveMediaItem (insert) returned empty ID').to.exist;

			let foundTvShow = await tvShowEntityController.getMediaItem(firstUCG.user, firstUCG.category, insertedId);
			expect(foundTvShow, 'GetMediaItem returned an undefined result').not.to.be.undefined;
			foundTvShow = foundTvShow as TvShowInternal;
			helperCompareSeasons(insertedTvShow.seasons, foundTvShow.seasons);
		});

		it('GetMediaItem should return the correct seasons (actual values) after SaveMediaItem', async() => {

			const tvShow = getTestTvShow(undefined, firstUCG);
			tvShow.seasons = [{
				number: 1,
				episodesNumber: 10,
				watchedEpisodesNumber: 5
			}, {
				number: 2,
				episodesNumber: 10
			}, {
				number: 3
			}];

			const insertedTvShow = await tvShowEntityController.saveMediaItem(tvShow);
			const insertedId = insertedTvShow._id;
			expect(insertedTvShow._id, 'SaveMediaItem (insert) returned empty ID').to.exist;

			let foundTvShow = await tvShowEntityController.getMediaItem(firstUCG.user, firstUCG.category, insertedId);
			expect(foundTvShow, 'GetMediaItem returned an undefined result').not.to.be.undefined;
			foundTvShow = foundTvShow as TvShowInternal;
			helperCompareSeasons(insertedTvShow.seasons, foundTvShow.seasons);
		});

		it('SaveMediaItem (insert) should not accept invalid season numbers', async() => {

			try {

				const tvShow = getTestTvShow(undefined, firstUCG);
				tvShow.seasons = [{
					number: -1,
					episodesNumber: 10,
					watchedEpisodesNumber: 5
				}];

				await tvShowEntityController.saveMediaItem(tvShow);
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});

		it('SaveMediaItem (insert) should not accept unordered season numbers', async() => {

			try {

				const tvShow = getTestTvShow(undefined, firstUCG);
				tvShow.seasons = [{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 5
				}, {
					number: 3,
					episodesNumber: 10
				}, {
					number: 2
				}];

				await tvShowEntityController.saveMediaItem(tvShow);
			}
			catch(error) {

				return;
			}

			throw 'SaveMediaItem should have returned an error';
		});
	});
});
