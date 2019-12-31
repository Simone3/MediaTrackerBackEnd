import { ModelMapper } from 'app/data/mappers/common';
import { oldAppCategoryMapper } from 'app/data/mappers/import/old-app/category';
import { ownPlatformMapper } from 'app/data/mappers/own-platform';
import { OldAppExport, OldAppExportImportOptions } from 'app/data/models/api/import/old-app/export';
import { AppError } from 'app/data/models/error/error';
import { OldAppExportImportOptionsInternal, OldAppExportInternal } from 'app/data/models/internal/import/old-app/export';

/**
 * Mapper for the old Media Tracker app export
 */
class OldAppExportMapper extends ModelMapper<OldAppExportInternal, OldAppExport, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(): OldAppExport {
		
		throw AppError.GENERIC.withDetails('Not required');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppExport): OldAppExportInternal {
		
		return {
			categories: source.CATEGORIES ? oldAppCategoryMapper.toInternalList(source.CATEGORIES) : undefined
		};
	}
}

/**
 * Mapper for the old Media Tracker app import options
 */
class OldAppExportImportOptionsMapper extends ModelMapper<OldAppExportImportOptionsInternal, OldAppExportImportOptions, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(): OldAppExportImportOptions {
		
		throw AppError.GENERIC.withDetails('Not required');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppExportImportOptions): OldAppExportImportOptionsInternal {

		return {
			defaultOwnPlatform: ownPlatformMapper.toInternal({
				...source.defaultOwnPlatform,
				uid: ''
			}, {
				categoryId: '',
				userId: ''
			})
		};
	}
}

/**
 * Singleton instance of the old Media Tracker app export mapper
 */
export const oldAppExportMapper = new OldAppExportMapper();

/**
 * Singleton instance of the old Media Tracker app import options mapper
 */
export const oldAppExportImportOptionsMapper = new OldAppExportImportOptionsMapper();
