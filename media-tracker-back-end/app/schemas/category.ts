import { INTERNAL_MEDIA_TYPES } from 'app/data/models/internal/category';
import { Schema } from 'mongoose';

/**
 * Database schema for categories
 */
export const CategorySchema: Schema = new Schema({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	mediaType: { type: String, enum: INTERNAL_MEDIA_TYPES, required: true },
	color: { type: String, required: true }
}, {
	timestamps: true
});

/**
 * Categories collection name
 */
export const CATEGORY_COLLECTION_NAME = 'Category';
