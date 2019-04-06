export type Config = {

	server: ServerConfig,
	db: DbConfig,
	externalApis: ExternalApisConfig
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
	searchRelativePath: string,
	getDetailsRelativePath: string,
	directorJobName: string,
}
