export type Config = {
	server: {
		port: number,
	},
	db: {
		url: string,
	},
	externalApis: {
		timeoutMilliseconds: number,
		theMovieDb: {
			basePath: string,
			movies: {
				search: {
					relativePath: string,
					queryParams: {
						api_key: string,
						query: string
					}
				},
				details: {
					relativePath: string,
					queryParams: {
						api_key: string,
						append_to_response: string
					}
				}
				directorJobName: string
			},
			tvShows: {
				search: {
					relativePath: string,
					queryParams: {
						api_key: string,
						query: string
					}
				},
				details: {
					relativePath: string,
					queryParams: {
						api_key: string
					}
				},
				season: {
					relativePath: string,
					queryParams: {
						api_key: string
					}
				}
			}
		},
		googleBooks: {
			basePath: string,
			search: {
				relativePath: string,
				queryParams: {
					key: string,
					langRestrict: string
					country: string
					orderBy: string
					projection: string
					q: string
					maxResults: string
				}
			},
			details: {
				relativePath: string,
				queryParams: {
					key: string,
				}
			}
		}
	},
	log: {
		level: 'debug' | 'info' | 'error',
		file: string,
		logApisInputOutput: boolean,
		logExternalApisInputOutput: boolean,
		logDatabaseQueries: boolean
	}
}
