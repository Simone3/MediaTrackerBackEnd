import { Config } from "./config-type";

export const config: Config = {
	server: {
		port: 3000
	},
	db: {
		url: 'mongodb://<your_db_host_here>/<your_db_name_here>'
	},
	externalApis: {
		timeoutMilliseconds: 5000,
		theMovieDb: {
			basePath: 'http://api.themoviedb.org/3',
			movies: {
				search: {
					relativePath: '/search/movie/',
					queryParams: {
						api_key: '<your_api_key_here>',
						query: ''
					}
				},
				details: {
					relativePath: '/movie/:movieId',
					queryParams: {
						api_key: '<your_api_key_here>',
						append_to_response: 'credits'
					}
				},
				directorJobName: 'Director'
			},
			tvShows: {
				search: {
					relativePath: '/search/tv/',
					queryParams: {
						api_key: '<your_api_key_here>',
						query: ''
					}
				},
				details: {
					relativePath: '/tv/:tvShowId',
					queryParams: {
						api_key: '<your_api_key_here>'
					}
				},
				season: {
					relativePath: '/tv/:tvShowId/season/:seasonNumber',
					queryParams: {
						api_key: '<your_api_key_here>',
					}
				}
			}
		},
		googleBooks: {
			basePath: 'https://www.googleapis.com/books/v1',
			search: {
				relativePath: '/volumes',
				queryParams: {
					key: '<your_api_key_here>',
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
					key: '<your_api_key_here>',
				}
			}
		}
	},
	log: {
		level: 'debug',
		file: '<your_path_here>/media-tracker.log',
		logApisInputOutput: true,
		logExternalApisInputOutput: true,
		logDatabaseQueries: true
	}
};