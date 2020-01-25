import { Config } from 'app/config/type-config';

/**
 * Sample configuration that can be used as a template for the MEDIA_TRACKER_BE_CONFIG environment variable (see config.ts)
 * It must be trasformed into a valid JSON.
 */
export const sampleConfig: Config = {
	server: {
		port: 3000
	},
	db: {
		url: 'mongodb://<your_db_host_here>/<your_db_name_here>'
	},
	externalApis: {
		timeoutMilliseconds: 5000,
		userAgent: '<your_user_agent>',
		theMovieDb: {
			basePath: 'http://api.themoviedb.org/3',
			movies: {
				imageBasePath: 'http://image.tmdb.org/t/p/w780',
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
				imageBasePath: 'http://image.tmdb.org/t/p/w780',
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
						api_key: '<your_api_key_here>'
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
					key: '<your_api_key_here>'
				}
			}
		},
		giantBomb: {
			basePath: 'http://www.giantbomb.com/api',
			search: {
				relativePath: '/search',
				queryParams: {
					api_key: '<your_api_key_here>',
					format: 'json',
					resources: 'game',
					limit: '10',
					query: ''
				}
			},
			details: {
				relativePath: '/game/:videogameId',
				queryParams: {
					api_key: '<your_api_key_here>',
					format: 'json',
					field_list: 'id,original_release_date,expected_release_day,expected_release_month,expected_release_year,genres,name,deck,developers,publishers,platforms,image'
				}
			}
		}
	},
	log: {
		level: 'debug',
		file: '<your_path_here>/media-tracker.log',
		apisInputOutput: {
			active: true,
			excludeRequestBodyRegExp: [ '^/users/[^/]+/import/old-app$' ],
			excludeResponseBodyRegExp: []
		},
		externalApisInputOutput: {
			active: true
		},
		databaseQueries: {
			active: true
		},
		performance: {
			active: true
		}
	},
	firebase: {
		databaseUrl: 'https://<your_project_here>.firebaseio.com',
		serviceAccountKey: {
			/* Your private key JSON (downloaded from Firebase console) contents here */
		}
	}
};
