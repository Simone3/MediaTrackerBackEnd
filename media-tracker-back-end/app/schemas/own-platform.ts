import { CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { Schema } from 'mongoose';

/**
 * Database schema for platforms where some user owns some media item
 */
export const OwnPlatformSchema: Schema = new Schema({
	name: { type: String, required: true },
	color: { type: String, required: true },
	icon: { type: String, required: true },
	owner: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true }
}, {
	timestamps: true
});

/**
 * OwnPlatforms collection name
 */
export const OWN_PLATFORM_COLLECTION_NAME = 'OwnPlatform';
