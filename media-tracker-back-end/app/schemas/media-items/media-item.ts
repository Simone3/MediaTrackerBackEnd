import { CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { GROUP_COLLECTION_NAME } from 'app/schemas/group';
import { USER_COLLECTION_NAME } from 'app/schemas/user';
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import { OWN_PLATFORM_COLLECTION_NAME } from '../own-platform';

/**
 * Common schema definition for a generic media item
 */
export const commonMediaItemSchemaDefinition: SchemaDefinition = {
	name: { type: String, required: true },
	owner: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
	category: { type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true },
	group: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: false },
	ownPlatform: { type: Schema.Types.ObjectId, ref: OWN_PLATFORM_COLLECTION_NAME, required: false },
	orderInGroup: { type: Number, required: false },
	importance: { type: Number, required: true },
	genres: { type: [ String ], required: false },
	description: { type: String, required: false },
	userComment: { type: String, required: false },
	completedAt: { type: [ Date ], required: false },
	releaseDate: { type: Date, required: false },
	active: { type: String, required: false },
	catalogId: { type: String, required: false },
	imageUrl: { type: String, required: false }
};

/**
 * Common schema options for a generic media item
 */
export const commonMediaItemSchemaOptions: SchemaOptions = {
	timestamps: true
};
