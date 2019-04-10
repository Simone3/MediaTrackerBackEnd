import { Schema } from "mongoose";
import { USER_COLLECTION_NAME } from "./user";
import { CATEGORY_COLLECTION_NAME } from "./category";

/**
 * Database schema for groups
 */
export const GroupSchema: Schema = new Schema({
	name: {type: String, required: true},
	owner: {type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true},
	category: {type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true},
}, {
	timestamps: true
});

/**
 * Groups collection name
 */
export const GROUP_COLLECTION_NAME = 'Group';