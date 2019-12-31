/**
 * Type for configuration files
 */
export type Config = {
	server: {
		port: number;
	};
	db: {
		url: string;
	};
	externalApis: {
		timeoutMilliseconds: number;
		userAgent: string;
		theMovieDb: {
			basePath: string;
			movies: {
				search: {
					relativePath: string;
					queryParams: {
						api_key: string;
						query: string;
					};
				};
				details: {
					relativePath: string;
					queryParams: {
						api_key: string;
						append_to_response: string;
					};
				};
				directorJobName: string;
			};
			tvShows: {
				search: {
					relativePath: string;
					queryParams: {
						api_key: string;
						query: string;
					};
				};
				details: {
					relativePath: string;
					queryParams: {
						api_key: string;
					};
				};
				season: {
					relativePath: string;
					queryParams: {
						api_key: string;
					};
				};
			};
		};
		googleBooks: {
			basePath: string;
			search: {
				relativePath: string;
				queryParams: {
					key: string;
					langRestrict: string;
					country: string;
					orderBy: string;
					projection: string;
					q: string;
					maxResults: string;
				};
			};
			details: {
				relativePath: string;
				queryParams: {
					key: string;
				};
			};
		};
		giantBomb: {
			basePath: string;
			search: {
				relativePath: string;
				queryParams: {
					api_key: string;
					format: string;
					resources: string;
					limit: string;
					query: string;
				};
			};
			details: {
				relativePath: string;
				queryParams: {
					api_key: string;
					format: string;
					field_list: string;
				};
			};
		};
	};
	log: {
		level: 'debug' | 'info' | 'error' | 'off';
		file: string;
		apisInputOutput: {
			active: boolean;
			excludeRequestBodyRegExp: RegExp[];
			excludeResponseBodyRegExp: RegExp[];
		};
		externalApisInputOutput: {
			active: boolean;
		};
		databaseQueries: {
			active: boolean;
		};
	};
	firebase: {
		databaseUrl: string;
		serviceAccountKey: {[key: string]: string};
	};
}