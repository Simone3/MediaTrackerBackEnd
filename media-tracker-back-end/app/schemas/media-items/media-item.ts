import { Schema, SchemaDefinition, SchemaOptions } from "mongoose";
import { CATEGORY_COLLECTION_NAME } from "../category";
import { USER_COLLECTION_NAME } from "../user";
import { GROUP_COLLECTION_NAME } from "../group";

/**
 * Common schema definition for a generic media item
 */
export const commonMediaItemSchemaDefinition: SchemaDefinition = {
	name: {type: String, required: true},
	importance: {type: Number, required: true},
	owner: {type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true},
	category: {type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true},
	group: {type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: false},
	orderInGroup: {type: Number, required: false}
}

/**
 * Common schema options for a generic media item
 */
export const commonMediaItemSchemaOptions: SchemaOptions = {
	timestamps: true
};
