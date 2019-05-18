import { Config } from 'app/config/type-config';

/**
 * Configuration for automatic testing (unit and integration)
 */
export const testConfig: Config = {
	server: {
		port: 3123
	},
	db: {
		url: 'mongodb://localhost/mediaTrackerBackEndTestDatabase'
	},
	externalApis: {
		timeoutMilliseconds: 1,
		userAgent: '',
		theMovieDb: {
			basePath: 'http://mock-movie-api',
			movies: {
				search: {
					relativePath: '/search/movie/',
					queryParams: {
						api_key: 'mock-api-key',
						query: ''
					}
				},
				details: {
					relativePath: '/movie/:movieId',
					queryParams: {
						api_key: 'mock-api-key',
						append_to_response: 'credits'
					}
				},
				directorJobName: 'Director'
			},
			tvShows: {
				search: {
					relativePath: '/search/tv/',
					queryParams: {
						api_key: 'mock-api-key',
						query: ''
					}
				},
				details: {
					relativePath: '/tv/:tvShowId',
					queryParams: {
						api_key: 'mock-api-key'
					}
				},
				season: {
					relativePath: '/tv/:tvShowId/season/:seasonNumber',
					queryParams: {
						api_key: 'mock-api-key'
					}
				}
			}
		},
		googleBooks: {
			basePath: 'http://mock-book-api',
			search: {
				relativePath: '/volumes',
				queryParams: {
					key: 'mock-api-key',
					langRestrict: 'en',
					country: 'US',
					orderBy: 'relevance',
					projection: 'lite',
					q: '',
					maxResults: '10'
				}
			},
			details: {
				relativePath: '/volumes/:bookId',
				queryParams: {
					key: 'mock-api-key'
				}
			}
		},
		giantBomb: {
			basePath: 'http://mock-videogame-api',
			search: {
				relativePath: '/search',
				queryParams: {
					api_key: 'mock-api-key',
					format: 'json',
					resources: 'game',
					limit: '10',
					query: ''
				}
			},
			details: {
				relativePath: '/game/:videogameId',
				queryParams: {
					api_key: 'mock-api-key',
					format: 'json',
					field_list: 'id,original_release_date,expected_release_day,expected_release_month,expected_release_year,genres,name,deck,developers,publishers,platforms,image'
				}
			}
		}
	},
	log: {
		level: 'off',
		file: 'C:/dev/MediaTracker/logs/media-tracker-tests.log',
		logApisInputOutput: true,
		logExternalApisInputOutput: true,
		logDatabaseQueries: true
	}
};
