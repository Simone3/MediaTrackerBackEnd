import { Document } from "mongoose";
import { MediaItemEntityController } from "./media-item";
import { BookInternal, BookSortByInternal, BookFilterInternal } from "../../../models/internal/media-items/book";
import { Model, model } from "mongoose";
import { BOOK_COLLECTION_NAME, BookSchema } from "../../../schemas/media-items/book";
import { Queryable, SortDirection, Sortable } from "../../../controllers/database/query-helper";
import { MediaTypeInternal } from "../../../models/internal/category";

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
	 * @override
	 */
	protected getModelType(): Model<BookInternal & Document> {
		
		return BookModel;
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
				sortConditions.author = sortDirection;
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
			author: termRegExp
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


