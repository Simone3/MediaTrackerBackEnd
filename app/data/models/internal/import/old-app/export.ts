import { OldAppCategoryInternal } from 'app/data/models/internal/import/old-app/category';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Model for the old Media Tracker app export, internal type NOT to be exposed via API
 */
export type OldAppExportInternal = {

	categories?: OldAppCategoryInternal[];
}

/**
 * Model for the old Media Tracker app export import options, internal type NOT to be exposed via API
 */
export type OldAppExportImportOptionsInternal = {

	defaultOwnPlatform: OwnPlatformInternal;
}
