import { Schema } from 'mongoose';

/**
 * Database schema for users
 */
export const UserSchema: Schema = new Schema({
	name: { type: String, required: true },
	author: { type: String, required: false }
}, {
	timestamps: true
});

/**
 * Users collection name
 */
export const USER_COLLECTION_NAME = 'User';
