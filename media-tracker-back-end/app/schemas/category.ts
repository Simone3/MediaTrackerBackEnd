import { INTERNAL_MEDIA_TYPES } from "app/models/internal/category";
import { USER_COLLECTION_NAME } from "app/schemas/user";
import { Schema } from "mongoose";

/**
 * Database schema for categories
 */
export const CategorySchema: Schema = new Schema({
	name: {type: String, required: true},
	owner: {type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true},
	mediaType: {type: String, enum: INTERNAL_MEDIA_TYPES, required: true}
}, {
	timestamps: true
});

/**
 * Categories collection name
 */
export const CATEGORY_COLLECTION_NAME = 'Category';