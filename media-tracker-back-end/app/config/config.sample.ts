import { Config } from "./config-type";

export const config: Config = {

	serverPort: 3000,
	databaseUrl: 'mongodb://<host>/<name>',
	theMovieDbBasePath: 'http://api.themoviedb.org/3',
	theMovieDbSearchRelativePath: '/search/movie/?',
	theMovieDbGetDetailsRelativePath: '/movie/:movieId',
	theMovieDbApiKey: '<api_key>',
	theMovieDbDirectorJobName: 'Director',
	externalApiTimeoutMilliseconds: 5000
};