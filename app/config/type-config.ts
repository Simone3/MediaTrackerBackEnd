import { ValuesOf } from 'app/utilities/helper-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsIn, IsNumber, IsString, ValidateNested } from 'class-validator';

class ServerConfig {

	@IsDefined()
	@IsNumber()
	public port!: number;
}

class DbConfig {

	@IsDefined()
	@IsString()
	public url!: string;
}

class TheMovieDbMoviesSearchQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;

	@IsDefined()
	@IsString()
	public query!: string;
}

class TheMovieDbMoviesSearchConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbMoviesSearchQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: TheMovieDbMoviesSearchQueryParamsConfig;
}

class TheMovieDbMoviesDetailsQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;

	@IsDefined()
	@IsString()
	public append_to_response!: string;
}

class TheMovieDbMoviesDetailsConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbMoviesDetailsQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: TheMovieDbMoviesDetailsQueryParamsConfig;
}

class TheMovieDbMoviesConfig {

	@IsDefined()
	@IsString()
	public imageBasePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbMoviesSearchConfig;
	})
	@ValidateNested()
	public search!: TheMovieDbMoviesSearchConfig;

	@IsDefined()
	@Type(() => {
		return TheMovieDbMoviesDetailsConfig;
	})
	@ValidateNested()
	public details!: TheMovieDbMoviesDetailsConfig;

	@IsDefined()
	@IsString()
	public directorJobName!: string;
}

class TheMovieDbTvShowsSearchQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;

	@IsDefined()
	@IsString()
	public query!: string;
}

class TheMovieDbTvShowsSearchConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsSearchQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: TheMovieDbTvShowsSearchQueryParamsConfig;
}

class TheMovieDbTvShowsDetailsQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;
}

class TheMovieDbTvShowsDetailsConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsDetailsQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: TheMovieDbTvShowsDetailsQueryParamsConfig;
}

class TheMovieDbTvShowsSeasonQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;
}

class TheMovieDbTvShowsSeasonsConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsSeasonQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: TheMovieDbTvShowsSeasonQueryParamsConfig;
}

class TheMovieDbTvShowsConfig {

	@IsDefined()
	@IsString()
	public imageBasePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsSearchConfig;
	})
	@ValidateNested()
	public search!: TheMovieDbTvShowsSearchConfig;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsDetailsConfig;
	})
	@ValidateNested()
	public details!: TheMovieDbTvShowsDetailsConfig;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsSeasonsConfig;
	})
	@ValidateNested()
	public season!: TheMovieDbTvShowsSeasonsConfig;
}

class TheMovieDbConfig {

	@IsDefined()
	@IsString()
	public basePath!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbMoviesConfig;
	})
	@ValidateNested()
	public movies!: TheMovieDbMoviesConfig;

	@IsDefined()
	@Type(() => {
		return TheMovieDbTvShowsConfig;
	})
	@ValidateNested()
	public tvShows!: TheMovieDbTvShowsConfig;
}

class GoogleBooksSearchQueryParamsConfig {

	@IsDefined()
	@IsString()
	public key!: string;

	@IsDefined()
	@IsString()
	public langRestrict!: string;

	@IsDefined()
	@IsString()
	public country!: string;

	@IsDefined()
	@IsString()
	public orderBy!: string;

	@IsDefined()
	@IsString()
	public projection!: string;

	@IsDefined()
	@IsString()
	public q!: string;

	@IsDefined()
	@IsString()
	public maxResults!: string;
}

class GoogleBooksSearchConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return GoogleBooksSearchQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: GoogleBooksSearchQueryParamsConfig;
}

class GoogleBooksDetailsQueryParamsConfig {

	@IsDefined()
	@IsString()
	public key!: string;
}

class GoogleBooksDetailsConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return GoogleBooksDetailsQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: GoogleBooksDetailsQueryParamsConfig;
}

class GoogleBooksConfig {

	@IsDefined()
	@IsString()
	public basePath!: string;

	@IsDefined()
	@Type(() => {
		return GoogleBooksSearchConfig;
	})
	@ValidateNested()
	public search!: GoogleBooksSearchConfig;

	@IsDefined()
	@Type(() => {
		return GoogleBooksDetailsConfig;
	})
	@ValidateNested()
	public details!: GoogleBooksDetailsConfig;
}

class GiantBombSearchQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;

	@IsDefined()
	@IsString()
	public format!: string;

	@IsDefined()
	@IsString()
	public resources!: string;

	@IsDefined()
	@IsString()
	public limit!: string;

	@IsDefined()
	@IsString()
	public query!: string;
}

class GiantBombSearchConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return GiantBombSearchQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: GiantBombSearchQueryParamsConfig;
}

class GiantBombDetailsQueryParamsConfig {

	@IsDefined()
	@IsString()
	public api_key!: string;

	@IsDefined()
	@IsString()
	public format!: string;

	@IsDefined()
	@IsString()
	public field_list!: string;
}

class GiantBombDetailsConfig {

	@IsDefined()
	@IsString()
	public relativePath!: string;

	@IsDefined()
	@Type(() => {
		return GiantBombDetailsQueryParamsConfig;
	})
	@ValidateNested()
	public queryParams!: GiantBombDetailsQueryParamsConfig;
}

class GiantBombConfig {

	@IsDefined()
	@IsString()
	public basePath!: string;

	@IsDefined()
	@Type(() => {
		return GiantBombSearchConfig;
	})
	@ValidateNested()
	public search!: GiantBombSearchConfig;

	@IsDefined()
	@Type(() => {
		return GiantBombDetailsConfig;
	})
	@ValidateNested()
	public details!: GiantBombDetailsConfig;
}

class ExternalApisConfig {

	@IsDefined()
	@IsNumber()
	public timeoutMilliseconds!: number;

	@IsDefined()
	@IsString()
	public userAgent!: string;

	@IsDefined()
	@Type(() => {
		return TheMovieDbConfig;
	})
	@ValidateNested()
	public theMovieDb!: TheMovieDbConfig;

	@IsDefined()
	@Type(() => {
		return GoogleBooksConfig;
	})
	@ValidateNested()
	public googleBooks!: GoogleBooksConfig;

	@IsDefined()
	@Type(() => {
		return GiantBombConfig;
	})
	@ValidateNested()
	public giantBomb!: GiantBombConfig;
}

const LOG_LEVEL_CONFIG_VALUES: [ 'debug', 'info', 'error', 'off' ] = [ 'debug', 'info', 'error', 'off' ];

type LogLevelConfig = ValuesOf<typeof LOG_LEVEL_CONFIG_VALUES>;

class LogApisInputOutputConfig {

	@IsDefined()
	@IsBoolean()
	public active!: boolean;
	
	@IsDefined()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public excludeRequestBodyRegExp!: string[];

	@IsDefined()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public excludeResponseBodyRegExp!: string[];
}

class LogExternalApisInputOutputConfig {

	@IsDefined()
	@IsBoolean()
	public active!: boolean;
}

class LogDatabaseQueriesConfig {

	@IsDefined()
	@IsBoolean()
	public active!: boolean;
}

class LogPerformanceConfig {

	@IsDefined()
	@IsBoolean()
	public active!: boolean;
}

class LogConfig {

	@IsDefined()
	@IsString()
	@IsIn(LOG_LEVEL_CONFIG_VALUES)
	public level!: LogLevelConfig;

	@IsDefined()
	@IsString()
	public file!: string;

	@IsDefined()
	@Type(() => {
		return LogApisInputOutputConfig;
	})
	@ValidateNested()
	public apisInputOutput!: LogApisInputOutputConfig;

	@IsDefined()
	@Type(() => {
		return LogExternalApisInputOutputConfig;
	})
	@ValidateNested()
	public externalApisInputOutput!: LogExternalApisInputOutputConfig;

	@IsDefined()
	@Type(() => {
		return LogDatabaseQueriesConfig;
	})
	@ValidateNested()
	public databaseQueries!: LogDatabaseQueriesConfig;

	@IsDefined()
	@Type(() => {
		return LogPerformanceConfig;
	})
	@ValidateNested()
	public performance!: LogPerformanceConfig;
}

class FirebaseConfig {

	@IsDefined()
	@IsString()
	public databaseUrl!: string;

	@IsDefined()
	public serviceAccountKey!: {[key: string]: string};
}

/**
 * Type for configuration files
 */
export class Config {

	@IsDefined()
	@Type(() => {
		return ServerConfig;
	})
	@ValidateNested()
	public server!: ServerConfig;

	@IsDefined()
	@Type(() => {
		return DbConfig;
	})
	@ValidateNested()
	public db!: DbConfig;

	@IsDefined()
	@Type(() => {
		return ExternalApisConfig;
	})
	@ValidateNested()
	public externalApis!: ExternalApisConfig;

	@IsDefined()
	@Type(() => {
		return LogConfig;
	})
	@ValidateNested()
	public log!: LogConfig;

	@IsDefined()
	@Type(() => {
		return FirebaseConfig;
	})
	@ValidateNested()
	public firebase!: FirebaseConfig;
}
