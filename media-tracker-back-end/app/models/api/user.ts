import { CommonRequest, CommonResponse } from 'app/models/api/common';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a user, publicly exposed via API
 */
export class User {

	/**
	 * The user name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;
};

/**
 * Model for a user with an ID property, publicly exposed via API
 */
export class IdentifiedUser extends User {

	/**
	 * The user unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Request for the "add user" API
 */
export class AddUserRequest extends CommonRequest {

	@IsDefined()
	@Type(() => User)
	@ValidateNested()
	newUser!: User;
};

/**
 * Response for the "add user" API
 */
export class AddUserResponse extends CommonResponse {

	/**
	 * The user unique ID
	 */
	@IsNotEmpty()
	@IsString()
	userId!: string;
}

/**
 * Response for the "delete user" API
 */
export class DeleteUserResponse extends CommonResponse {

}

/**
 * Request for the "update user" API
 */
export class UpdateUserRequest extends CommonRequest {

	@IsDefined()
	@Type(() => User)
	@ValidateNested()
	user!: User;
};

/**
 * Response for the "update user" API
 */
export class UpdateUserResponse extends CommonResponse {

}