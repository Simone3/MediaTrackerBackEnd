import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { tvShowExternalDetailsServiceMapper, tvShowExternalSearchServiceMapper } from 'app/data/mappers/external-services/tv-show';
import { AppError } from 'app/data/models/error/error';
import { TmdbTvShowDetailsResponse, TmdbTvShowSearchResponse, TmdbTvShowSeasonDataResponse } from 'app/data/models/external-services/media-items/tv-show';
import { CatalogTvShowInternal, SearchTvShowCatalogResultInternal } from 'app/data/models/internal/media-items/tv-show';
import { logger } from 'app/loggers/logger';
import { InvocationParams } from 'app/utilities/helper-types';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Controller for TV show catalog
 */
class TvShowCatalogController extends MediaItemCatalogController<SearchTvShowCatalogResultInternal, CatalogTvShowInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchTvShowCatalogResultInternal[]> {

		return new Promise((resolve, reject): void => {
		
			const url = miscUtils.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.tvShows.search.relativePath
			]);

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.theMovieDb.tvShows.search.queryParams);
			queryParams.query = searchTerm;

			const invocationParams: InvocationParams<undefined, TmdbTvShowSearchResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: TmdbTvShowSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invoke(invocationParams)
				.then((response) => {

					if(response.results) {

						resolve(tvShowExternalSearchServiceMapper.toInternalList(response.results));
					}
					else {

						resolve([]);
					}
				})
				.catch((error) => {
					
					logger.error('TV show catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogTvShowInternal> {

		return new Promise((resolve, reject): void => {
		
			const pathParams = {
				tvShowId: catalogItemId
			};

			const url = miscUtils.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.tvShows.details.relativePath
			], pathParams);

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.theMovieDb.tvShows.details.queryParams);

			const invocationParams: InvocationParams<undefined, TmdbTvShowDetailsResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: TmdbTvShowDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			// First call the general details service
			restJsonInvoker.invoke(invocationParams)
				.then((detailsResponse) => {

					if(detailsResponse.in_production && detailsResponse.number_of_seasons && detailsResponse.number_of_seasons > 0) {

						// Then, if the show is in production, get current season data for next episode air date
						this.getSeasonData(catalogItemId, detailsResponse.number_of_seasons)
							.then((seasonResponse) => {

								resolve(tvShowExternalDetailsServiceMapper.toInternal(detailsResponse, { currentSeasonData: seasonResponse }));
							})
							.catch((error) => {

								logger.error('TV show catalog (season) invocation error: %s', error);
								reject(AppError.GENERIC.withDetails(error));
							});
					}
					else {

						resolve(tvShowExternalDetailsServiceMapper.toInternal(detailsResponse));
					}
				})
				.catch((error) => {
					
					logger.error('TV show catalog (details) invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}

	/**
	 * Helper to call the external API for a single season data
	 * @param catalogItemId the TV show catalog ID
	 * @param seasonNumber the season to query
	 * @returns the parsed API response
	 */
	private getSeasonData(catalogItemId: string, seasonNumber: number): Promise<TmdbTvShowSeasonDataResponse> {

		const pathParams = {
			tvShowId: catalogItemId,
			seasonNumber: String(seasonNumber)
		};

		const url = miscUtils.buildUrl([
			config.externalApis.theMovieDb.basePath,
			config.externalApis.theMovieDb.tvShows.season.relativePath
		], pathParams);

		const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.theMovieDb.tvShows.season.queryParams);

		const invocationParams: InvocationParams<undefined, TmdbTvShowSeasonDataResponse> = {
			method: 'GET',
			url: url,
			responseBodyClass: TmdbTvShowSeasonDataResponse,
			queryParams: queryParams,
			timeoutMilliseconds: config.externalApis.timeoutMilliseconds
		};

		return restJsonInvoker.invoke(invocationParams);
	}
}

/**
 * Singleton implementation of the TV show catalog controller
 */
export const tvShowCatalogController = new TvShowCatalogController();

