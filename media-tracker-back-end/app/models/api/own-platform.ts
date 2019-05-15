import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest } from 'app/models/api/common';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsDefined, IsHexColor, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a platform where some user owns some media items, publicly exposed via API
 */
export class OwnPlatform {

	/**
	 * The platform name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;

	/**
	 * The platform color
	 */
	@IsNotEmpty()
	@IsHexColor()
	public color!: string;
}

/**
 * Model for a a platform where some user owns some media items with an ID property, publicly exposed via API
 */
export class IdentifiedOwnPlatform extends OwnPlatform {

	/**
	 * The platform unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Request for the 'add own platform' API
 */
export class AddOwnPlatformRequest extends CommonSaveRequest {

	/**
	 * The platform to add
	 */
	@IsDefined()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public newOwnPlatform!: OwnPlatform;
}

/**
 * Response for the 'add own platform' API
 */
export class AddOwnPlatformResponse extends CommonAddResponse {

}

/**
 * Response for the 'delete own platform' API
 */
export class DeleteOwnPlatformResponse extends CommonResponse {

}

/**
 * Response for the 'get all own platforms' API
 */
export class GetAllOwnPlatformsResponse extends CommonResponse {

	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedOwnPlatform;
	})
	@ValidateNested()
	public ownPlatforms: IdentifiedOwnPlatform[] = [];
}

/**
 * Request for the 'update own platform' API
 */
export class UpdateOwnPlatformRequest extends CommonSaveRequest {

	/**
	 * The platform to update
	 */
	@IsDefined()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public ownPlatform!: OwnPlatform;
}

/**
 * Response for the 'update own platform' API
 */
export class UpdateOwnPlatformResponse extends CommonResponse {

}

/**
 * Request for the 'merge own platforms' API
 */
export class MergeOwnPlatformsRequest extends CommonRequest {

	@IsDefined()
	@ArrayMinSize(2)
	@IsNotEmpty({ each: true })
	public ownPlatformIds!: string[];
	
	/**
	 * The final merged own platform data
	 */
	@IsDefined()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public mergedOwnPlatform!: OwnPlatform;
}

/**
 * Response for the 'merge own platforms' API
 */
export class MergeOwnPlatformsResponse extends CommonResponse {

}

