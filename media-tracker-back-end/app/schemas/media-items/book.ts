import { Schema } from "mongoose";
import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "./media-item";

/**
 * Database schema for books
 */
export const BookSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	author: {type: String, required: false}
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Books collection name
 */
export const BOOK_COLLECTION_NAME = 'Book';