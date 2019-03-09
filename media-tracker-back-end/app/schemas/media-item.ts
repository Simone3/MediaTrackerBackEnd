import { Schema } from "mongoose";

/**
 * Database schema for media items
 */
export const MediaItemSchema: Schema = new Schema({
	name: {type: String, required: true},
	author: {type: String, required: false}
}, {
	timestamps: true
});