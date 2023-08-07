import { config } from 'app/config/config';
import nock from 'nock';
import mockBookDetailsResponse from 'resources/mocks/external-services/mock-book-details-response-123.json';
import mockBookSearchResponse from 'resources/mocks/external-services/mock-book-search-response-mock-book.json';
import mockMovieDetailsResponse from 'resources/mocks/external-services/mock-movie-details-response-123.json';
import mockMovieSearchResponse from 'resources/mocks/external-services/mock-movie-search-response-mock-movie.json';
import mockTvShowDetailsResponse from 'resources/mocks/external-services/mock-tv-show-details-response-123.json';
import mockTvShowSearchResponse from 'resources/mocks/external-services/mock-tv-show-search-response-mock-tv-show.json';
import mockTvShowSeasonResponse from 'resources/mocks/external-services/mock-tv-show-season-response-123.json';
import mockVideogameDetailsResponse from 'resources/mocks/external-services/mock-videogame-details-response-123.json';
import mockVideogameSearchResponse from 'resources/mocks/external-services/mock-videogame-search-response-mock-videogame.json';

/**
 * Helper to initilize the external movie APIs mocks
 */
export const setupMovieExternalServicesMocks = (): void => {

	nock('http://mock-movie-api')
		.get('/search/movie')
		.query({
			...config.externalApis.theMovieDb.movies.search.queryParams,
			query: 'Mock Movie'
		})
		.reply(200, mockMovieSearchResponse);

	nock('http://mock-movie-api')
		.get('/movie/123')
		.query({
			...config.externalApis.theMovieDb.movies.details.queryParams
		})
		.reply(200, mockMovieDetailsResponse);
};

/**
 * Helper to initilize the external book APIs mocks
 */
export const setupBookExternalServicesMocks = (): void => {

	nock('http://mock-book-api')
		.get('/volumes')
		.query({
			...config.externalApis.googleBooks.search.queryParams,
			q: 'Mock Book'
		})
		.reply(200, mockBookSearchResponse);
	
	nock('http://mock-book-api')
		.get('/volumes/123')
		.query({
			...config.externalApis.googleBooks.details.queryParams
		})
		.reply(200, mockBookDetailsResponse);
};

/**
 * Helper to initilize the external TV show APIs mocks
 */
export const setupTvShowExternalServicesMocks = (): void => {
	
	nock('http://mock-movie-api')
		.get('/search/tv')
		.query({
			...config.externalApis.theMovieDb.tvShows.search.queryParams,
			query: 'Mock TV Show'
		})
		.reply(200, mockTvShowSearchResponse);

	nock('http://mock-movie-api')
		.get('/tv/123')
		.query({
			...config.externalApis.theMovieDb.tvShows.details.queryParams
		})
		.reply(200, mockTvShowDetailsResponse);
		
	nock('http://mock-movie-api')
		.get('/tv/123/season/8')
		.query({
			...config.externalApis.theMovieDb.tvShows.season.queryParams
		})
		.reply(200, mockTvShowSeasonResponse);
};

/**
 * Helper to initilize the external videogame APIs mocks
 */
export const setupVideogameExternalServicesMocks = (): void => {
		
	nock('http://mock-videogame-api')
		.get('/search')
		.query({
			...config.externalApis.giantBomb.search.queryParams,
			query: 'Mock Videogame'
		})
		.reply(200, mockVideogameSearchResponse);
			
	nock('http://mock-videogame-api')
		.get('/game/123')
		.query({
			...config.externalApis.giantBomb.details.queryParams
		})
		.reply(200, mockVideogameDetailsResponse);
};
