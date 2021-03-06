import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest } from 'app/data/models/api/common';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a group, publicly exposed via API
 */
export class Group {

	/**
	 * The group name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Model for a group with an ID property, publicly exposed via API
 */
export class IdentifiedGroup extends Group {

	/**
	 * The group unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Request for the 'add group' API
 */
export class AddGroupRequest extends CommonSaveRequest {

	/**
	 * The group to add
	 */
	@IsDefined()
	@Type(() => {
		return Group;
	})
	@ValidateNested()
	public newGroup!: Group;
}

/**
 * Response for the 'add group' API
 */
export class AddGroupResponse extends CommonAddResponse {

}

/**
 * Response for the 'delete group' API
 */
export class DeleteGroupResponse extends CommonResponse {

}

/**
 * Response for the 'get all groups' API
 */
export class GetAllGroupsResponse extends CommonResponse {

	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedGroup;
	})
	@ValidateNested()
	public groups: IdentifiedGroup[] = [];
}

/**
 * Group filtering options, publicly exposed via API
 */
export class GroupFilter {

	/**
	 * Filter for name (case-insensitive exact match)
	 */
	@IsOptional()
	@IsString()
	public name?: string;
}

/**
 * Request for the 'filter groups' API
 */
export class FilterGroupsRequest extends CommonRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return GroupFilter;
	})
	@ValidateNested()
	public filter?: GroupFilter;
}

/**
 * Response for the 'filter groups' API
 */
export class FilterGroupsResponse extends CommonResponse {

	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedGroup;
	})
	@ValidateNested()
	public groups: IdentifiedGroup[] = [];
}

/**
 * Request for the 'update group' API
 */
export class UpdateGroupRequest extends CommonSaveRequest {

	/**
	 * The group to update
	 */
	@IsDefined()
	@Type(() => {
		return Group;
	})
	@ValidateNested()
	public group!: Group;
}

/**
 * Response for the 'update group' API
 */
export class UpdateGroupResponse extends CommonResponse {

}
