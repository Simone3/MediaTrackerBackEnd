export type Config = {

	server: ServerConfig,
	db: DbConfig,
	externalApis: ExternalApisConfig,
	log: LogConfig
}

type ServerConfig = {
	port: number,
}

type DbConfig = {
	url: string,
}

type ExternalApisConfig = {
	timeoutMilliseconds: number,
	theMovieDb: TheMovieDbConfig
}

type TheMovieDbConfig = {
	apiKey: string,
	basePath: string,
	movies: TheMovieDbMoviesConfig,
	tvShows: TheMovieDbTvShowsConfig
}

type TheMovieDbMoviesConfig = {

	searchRelativePath: string,
	getDetailsRelativePath: string,
	directorJobName: string
}

type TheMovieDbTvShowsConfig = {

	searchRelativePath: string,
	getDetailsRelativePath: string,
	getSeasonRelativePath: string,
}

type LogConfig = {
	level: 'debug' | 'info' | 'error',
	file: string,
	logApisInputOutput: boolean,
	logExternalApisInputOutput: boolean,
	logDatabaseQueries: boolean
}