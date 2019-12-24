import { CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { GROUP_COLLECTION_NAME } from 'app/schemas/group';
import { OWN_PLATFORM_COLLECTION_NAME } from 'app/schemas/own-platform';
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

/**
 * Common schema definition for a generic media item
 */
export const commonMediaItemSchemaDefinition: SchemaDefinition = {
	name: { type: String, required: true },
	owner: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true },
	group: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: false },
	ownPlatform: { type: Schema.Types.ObjectId, ref: OWN_PLATFORM_COLLECTION_NAME, required: false },
	orderInGroup: { type: Number, required: false },
	importance: { type: String, required: true },
	genres: { type: [ String ], required: false },
	description: { type: String, required: false },
	userComment: { type: String, required: false },
	completedOn: { type: [ Date ], required: false },
	completedLastOn: { type: Date, required: false },
	releaseDate: { type: Date, required: false },
	active: { type: String, required: false },
	markedAsRedo: { type: String, required: false },
	catalogId: { type: String, required: false },
	imageUrl: { type: String, required: false }
};

/**
 * Common schema options for a generic media item
 */
export const commonMediaItemSchemaOptions: SchemaOptions = {
	timestamps: true
};
