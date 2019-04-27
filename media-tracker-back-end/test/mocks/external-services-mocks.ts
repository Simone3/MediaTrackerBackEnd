import { config } from 'app/config/config';
import nock from 'nock';
import mockMovieDetailsResponse from 'resources/mocks/external-services/mock-movie-details-response-123.json';
import mockMovieSearchResponse from 'resources/mocks/external-services/mock-movie-search-response-mock-movie.json';

/**
 * Helper to initilize the external APIs mocks
 */
export const setupExternalServicesMocks = (): void => {

	nock('http://mock-movie-api')
		.get('/search/movie/')
		.query({
			api_key: config.externalApis.theMovieDb.movies.search.queryParams.api_key,
			query: 'Mock Movie'
		})
		.reply(200, mockMovieSearchResponse);

	nock('http://mock-movie-api')
		.get('/movie/123')
		.query({
			api_key: config.externalApis.theMovieDb.movies.details.queryParams.api_key,
			append_to_response: config.externalApis.theMovieDb.movies.details.queryParams.append_to_response
		})
		.reply(200, mockMovieDetailsResponse);
};
