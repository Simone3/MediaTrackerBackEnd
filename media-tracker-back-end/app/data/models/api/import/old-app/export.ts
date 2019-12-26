import { CommonRequest, CommonResponse } from 'app/data/models/api/common';
import { OldAppCategory } from 'app/data/models/api/import/old-app/category';
import { OwnPlatform } from 'app/data/models/api/own-platform';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';

/**
 * Model for the old Media Tracker app export, publicly exposed via API
 */
export class OldAppExport {

	/**
	 * The list of categories
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return OldAppCategory;
	})
	@ValidateNested()
	public CATEGORIES?: OldAppCategory[];
}

/**
 * Model for the old Media Tracker app export import options, publicly exposed via API
 */
export class OldAppExportImportOptions {

	/**
	 * The default own platform values (replaces the "owned" boolean)
	 */
	@IsDefined()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public defaultOwnPlatform!: OwnPlatform;
}

/**
 * Request for the 'import old app export' API
 */
export class ImportOldAppExportRequest extends CommonRequest {

	/**
	 * The old Media Tracker app export
	 */
	@IsDefined()
	@Type(() => {
		return OldAppExport;
	})
	@ValidateNested()
	public export!: OldAppExport;

	/**
	 * The import options
	 */
	@IsDefined()
	@Type(() => {
		return OldAppExportImportOptions;
	})
	@ValidateNested()
	public options!: OldAppExportImportOptions;
}

/**
 * Response for the 'import old app export' API
 */
export class ImportOldAppExportResponse extends CommonResponse {

}
