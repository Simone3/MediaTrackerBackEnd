import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from 'app/schemas/media-items/media-item';
import { Schema } from 'mongoose';

/**
 * Database schema for books
 */
export const BookSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	author: { type: String, required: false },
	pagesNumber: { type: Number, required: false }
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Books collection name
 */
export const BOOK_COLLECTION_NAME = 'Book';
