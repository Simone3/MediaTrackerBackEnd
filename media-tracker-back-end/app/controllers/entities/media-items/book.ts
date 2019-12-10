import { Queryable, Sortable, SortDirection } from 'app/controllers/database/query-helper';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { BookFilterInternal, BookInternal, BookSortByInternal } from 'app/data/models/internal/media-items/book';
import { BookSchema, BOOK_COLLECTION_NAME } from 'app/schemas/media-items/book';
import { Document, Model, model } from 'mongoose';

/**
 * Book document for Mongoose
 */
interface BookDocument extends BookInternal, Document {}

/**
 * Mongoose model for books
 */
const BookModel: Model<BookDocument> = model<BookDocument>(BOOK_COLLECTION_NAME, BookSchema);

/**
 * Controller for book entities
 */
class BookEntityController extends MediaItemEntityController<BookInternal, BookSortByInternal, BookFilterInternal> {
	
	/**
	 * Constructor
	 */
	public constructor() {

		super(BookModel);
	}
	
	/**
	 * @override
	 */
	protected getNewEmptyDocument(): BookInternal & Document {

		return new BookModel();
	}
		
	/**
	 * @override
	 */
	protected getDefaultSortBy(): BookSortByInternal[] {
		
		return [{
			field: 'NAME',
			ascending: true
		}];
	}
	
	/**
	 * @override
	 */
	protected setSortConditions(sortBy: BookSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<BookInternal>): void {
		
		switch(sortBy.field) {

			case 'AUTHOR':
				sortConditions.authors = sortDirection;
				break;
			
			default:
				return this.setCommonSortConditions(sortBy.field, sortDirection, sortConditions);
		}
	}
	
	/**
	 * @override
	 */
	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: Queryable<BookInternal>[]): void {
		
		searchConditions.push({
			authors: termRegExp
		});
	}

	/**
	 * @override
	 */
	protected getLinkedMediaType(): MediaTypeInternal {
		
		return 'BOOK';
	}
}

/**
 * Singleton implementation of the book entity controller
 */
export const bookEntityController = new BookEntityController();
