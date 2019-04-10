import { IsNotEmpty, IsString, ValidateNested, IsDefined, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonRequest, CommonResponse } from './common';

/**
 * Model for a group, publicly exposed via API
 */
export class Group {

	/**
	 * The group name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;
};

/**
 * Model for a group with an ID property, publicly exposed via API
 */
export class IdentifiedGroup extends Group {

	/**
	 * The group unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Request for the "add group" API
 */
export class AddGroupRequest extends CommonRequest {

	/**
	 * The group to add
	 */
	@IsDefined()
	@Type(() => Group)
	@ValidateNested()
	newGroup!: Group;

	/**
	 * If true, the group is allowed to have the same name of another existing group
	 */
	@IsOptional()
	@IsBoolean()
	allowSameName?: boolean;
};

/**
 * Response for the "add group" API
 */
export class AddGroupResponse extends CommonResponse {

}

/**
 * Response for the "delete group" API
 */
export class DeleteGroupResponse extends CommonResponse {

}

/**
 * Response for the "get all groups" API
 */
export class GetAllGroupsResponse extends CommonResponse {

	groups: IdentifiedGroup[] = [];
};

/**
 * Request for the "update group" API
 */
export class UpdateGroupRequest extends CommonRequest {

	/**
	 * The group to update
	 */
	@IsDefined()
	@Type(() => Group)
	@ValidateNested()
	group!: Group;

	/**
	 * If true, the group is allowed to have the same name of another existing group
	 */
	@IsOptional()
	@IsBoolean()
	allowSameName?: boolean;
};

/**
 * Response for the "update group" API
 */
export class UpdateGroupResponse extends CommonResponse {

}