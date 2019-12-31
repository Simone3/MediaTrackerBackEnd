import { OldAppBoolean, OLD_APP_BOOLEAN } from 'app/data/models/api/import/old-app/common';
import { ValuesOf } from 'app/utilities/helper-types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Array of all importance levels in the old Media Tracker app export, publicly exposed via API
 */
export const OLD_APP_IMPORTANCE_LEVELS: [ 'NONE', 'LOW', 'MEDIUM', 'HIGH' ] = [ 'NONE', 'LOW', 'MEDIUM', 'HIGH' ];

/**
 * A media item importance level in the old Media Tracker app export, publicly exposed via API
 */
export type OldAppImportanceLevel = ValuesOf<typeof OLD_APP_IMPORTANCE_LEVELS>;

/**
 * Model for a media item in the old Media Tracker app export, publicly exposed via API
 */
export class OldAppMediaItem {

	@IsNotEmpty()
	@IsString()
	public NAME!: string;

	@IsOptional()
	@IsString()
	public GENRES?: string;

	@IsOptional()
	@IsString()
	public DESCRIPTION?: string;

	@IsOptional()
	@IsString()
	public USER_COMMENT?: string;

	@IsOptional()
	@IsString()
	public COMPLETION_DATE?: string;

	@IsOptional()
	@IsString()
	public TIMES_COMPLETED?: string;

	@IsNotEmpty()
	@IsString()
	@IsIn(OLD_APP_IMPORTANCE_LEVELS)
	public IMPORTANCE_LEVEL!: OldAppImportanceLevel;

	@IsOptional()
	@IsString()
	@IsIn(OLD_APP_BOOLEAN)
	public OWNED?: OldAppBoolean;

	@IsOptional()
	@IsString()
	public RELEASE_DATE?: string;

	@IsOptional()
	@IsString()
	@IsIn(OLD_APP_BOOLEAN)
	public DOING_NOW?: OldAppBoolean;

	@IsOptional()
	@IsString()
	public EXTERNAL_SERVICE_ID?: string;

	@IsOptional()
	@IsString()
	public IMAGE?: string;

	@IsOptional()
	@IsString()
	public ORDER_IN_SECTION?: string;

	@IsOptional()
	@IsString()
	public PAGES_NUMBER?: string;

	@IsOptional()
	@IsString()
	public AUTHOR?: string;

	@IsOptional()
	@IsString()
	public DURATION_MIN?: string;

	@IsOptional()
	@IsString()
	public DIRECTOR?: string;

	@IsOptional()
	@IsString()
	public EPISODE_RUNTIME_MIN?: string;

	@IsOptional()
	@IsString()
	public CREATED_BY?: string;

	@IsOptional()
	@IsString()
	public EPISODES_NUMBER?: string;

	@IsOptional()
	@IsString()
	public SEASONS_NUMBER?: string;

	@IsOptional()
	@IsString()
	@IsIn(OLD_APP_BOOLEAN)
	public IN_PRODUCTION?: OldAppBoolean;

	@IsOptional()
	@IsString()
	public NEXT_EPISODE_AIR_DATE?: string;

	@IsOptional()
	@IsString()
	public DEVELOPER?: string;

	@IsOptional()
	@IsString()
	public PUBLISHER?: string;

	@IsOptional()
	@IsString()
	public PLATFORMS?: string;

	@IsOptional()
	@IsString()
	public AVERAGE_LENGTH_HOURS?: string;
}
