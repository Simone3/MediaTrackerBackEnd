import { Config } from "./config-type";

export const config: Config = {
	server: {
		port: 3000
	},
	db: {
		url: 'mongodb://<host>/<name>'
	},
	externalApis: {
		timeoutMilliseconds: 5000,
		theMovieDb: {
			apiKey: '<api_key>',
			basePath: 'http://api.themoviedb.org/3',
			movies: {
				searchRelativePath: '/search/movie/',
				getDetailsRelativePath: '/movie/:movieId',
				directorJobName: 'Director'
			},
			tvShows: {
				searchRelativePath: '/search/tv/',
				getDetailsRelativePath: '/tv/:tvShowId',
				getSeasonRelativePath: '/tv/:tvShowId/season/:seasonNumber'
			}
		}
	},
	log: {
		level: 'debug',
		file: '<path>/media-tracker.log',
		logApisInputOutput: true,
		logExternalApisInputOutput: true,
		logDatabaseQueries: true
	}
};