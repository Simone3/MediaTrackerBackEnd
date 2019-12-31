import { CategoryInternal } from 'app/data/models/internal/category';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Helper type to define the compare fields for CategoryInternal
 */
export type ExpectedCategoryInternal = Omit<CategoryInternal, '_id' | 'owner'>;

/**
 * Helper type to define the compare fields for MediaItemInternal
 */
export type ExpectedMediaItemInternal = Omit<MediaItemInternal, '_id' | 'owner' | 'category'>;

/**
 * Helper type to define the compare fields for BookInternal
 */
export type ExpectedBookInternal = Omit<BookInternal, '_id' | 'owner' | 'category'>;

/**
 * Helper type to define the compare fields for MovieInternal
 */
export type ExpectedMovieInternal = Omit<MovieInternal, '_id' | 'owner' | 'category'>;

/**
 * Helper type to define the compare fields for TvShowInternal
 */
export type ExpectedTvShowInternal = Omit<TvShowInternal, '_id' | 'owner' | 'category'>;

/**
 * Helper type to define the compare fields for VideogameInternal
 */
export type ExpectedVideogameInternal = Omit<VideogameInternal, '_id' | 'owner' | 'category'>;
