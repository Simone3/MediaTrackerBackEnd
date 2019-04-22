import { Schema } from "mongoose";
import { USER_COLLECTION_NAME } from "./user";
import { MediaTypeInternal } from "app/models/internal/category";
import { enumUtils } from "app/controllers/utilities/misc-utils";

/**
 * Database schema for categories
 */
export const CategorySchema: Schema = new Schema({
	name: {type: String, required: true},
	owner: {type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true},
	mediaType: {type: String, enum: enumUtils.getEnumStringValues(MediaTypeInternal), required: true}
}, {
	timestamps: true
});

/**
 * Categories collection name
 */
export const CATEGORY_COLLECTION_NAME = 'Category';