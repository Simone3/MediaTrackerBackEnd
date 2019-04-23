import { MediaItemCatalogController } from "../../../controllers/catalogs/media-items/media-item";
import { SearchTvShowCatalogResultInternal, CatalogTvShowInternal } from "../../../models/internal/media-items/tv-show";
import { miscUtilsController } from "../../../controllers/utilities/misc-utils";
import { TmdbTvShowSearchQueryParams, TmdbTvShowSearchResponse, TmdbTvShowDetailsQueryParams, TmdbTvShowDetailsResponse, TmdbTvShowSeasonDataQueryParams, TmdbTvShowSeasonDataResponse } from "../../../models/external-services/media-items/tv-show";
import { restJsonInvoker } from "../../../controllers/external-services/rest-json-invoker";
import { tvShowExternalSearchServiceMapper, tvShowExternalDetailsServiceMapper } from "../../../mappers/external-services/tv-show";
import { logger } from "../../../loggers/logger";
import { AppError } from "../../../models/error/error";
import { config } from "../../../config/config";

/**
 * Controller for TV show catalog
 */
class TvShowCatalogController extends MediaItemCatalogController<SearchTvShowCatalogResultInternal, CatalogTvShowInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchTvShowCatalogResultInternal[]> {

		return new Promise((resolve, reject) => {
		
			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.tvShows.searchRelativePath
			]);

			const queryParams: TmdbTvShowSearchQueryParams = {
				query: searchTerm,
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TmdbTvShowSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
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
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogTvShowInternal> {

		return new Promise((resolve, reject) => {
		
			const pathParams = {
				tvShowId: catalogItemId
			};

			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.tvShows.getDetailsRelativePath
			], pathParams);

			const queryParams: TmdbTvShowDetailsQueryParams = {
				api_key: config.externalApis.theMovieDb.apiKey
			};

			// First call the general details service
			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TmdbTvShowDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((detailsResponse) => {

				if(detailsResponse.in_production && detailsResponse.number_of_seasons && detailsResponse.number_of_seasons > 0) {

					// Then, if the show is in production, get current season data for next episode air date
					this.getSeasonData(catalogItemId, detailsResponse.number_of_seasons)
						.then((seasonResponse) => {

							resolve(tvShowExternalDetailsServiceMapper.toInternal(detailsResponse, {currentSeasonData: seasonResponse}));
						})
						.catch((error) => {

							logger.error('TV show catalog (season) invocation error: %s', error);
							reject(AppError.GENERIC.unlessAppError(error));
						})
				}
				else {

					resolve(tvShowExternalDetailsServiceMapper.toInternal(detailsResponse));
				}
			})
			.catch((error) => {
				
				logger.error('TV show catalog (details) invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}

	/**
	 * Helper to call the external API for a single season data
	 * @param catalogItemId the TV show catalog ID
	 * @param seasonNumber the season to query
	 */
	private getSeasonData(catalogItemId: string, seasonNumber: number): Promise<TmdbTvShowSeasonDataResponse> {

		const pathParams = {
			tvShowId: catalogItemId,
			seasonNumber: String(seasonNumber)
		};

		const url = miscUtilsController.buildUrl([
			config.externalApis.theMovieDb.basePath,
			config.externalApis.theMovieDb.tvShows.getSeasonRelativePath
		], pathParams);

		const queryParams: TmdbTvShowSeasonDataQueryParams = {
			api_key: config.externalApis.theMovieDb.apiKey
		};

		return restJsonInvoker.invokeGet({
			url: url,
			responseBodyClass: TmdbTvShowSeasonDataResponse,
			queryParams: queryParams,
			timeoutMilliseconds: config.externalApis.timeoutMilliseconds
		});
	} 
}

/**
 * Singleton implementation of the TV show catalog controller
 */
export const tvShowCatalogController = new TvShowCatalogController();

