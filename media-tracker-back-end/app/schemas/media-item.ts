import { Schema } from "mongoose";
import { CATEGORY_COLLECTION_NAME } from "./category";
import { USER_COLLECTION_NAME } from "./user";

/**
 * Database schema for media items
 */
export const MediaItemSchema: Schema = new Schema({
	name: {type: String, required: true},
	author: {type: String, required: false},
	importance: {type: Number, required: true},
	owner: {type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true},
	category: {type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true}
}, {
	timestamps: true
});

/**
 * Media items collection name
 */
export const MEDIA_ITEM_COLLECTION_NAME = 'MediaItem';