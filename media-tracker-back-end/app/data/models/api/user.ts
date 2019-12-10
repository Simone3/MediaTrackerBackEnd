import { CommonAddResponse, CommonRequest, CommonResponse } from 'app/data/models/api/common';
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
	public name!: string;
}

/**
 * Model for a user with an ID property, publicly exposed via API
 */
export class IdentifiedUser extends User {

	/**
	 * The user unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Request for the 'add user' API
 */
export class AddUserRequest extends CommonRequest {

	@IsDefined()
	@Type(() => {
		return User;
	})
	@ValidateNested()
	public newUser!: User;
}

/**
 * Response for the 'add user' API
 */
export class AddUserResponse extends CommonAddResponse {

}

/**
 * Response for the 'delete user' API
 */
export class DeleteUserResponse extends CommonResponse {

}

/**
 * Request for the 'update user' API
 */
export class UpdateUserRequest extends CommonRequest {

	@IsDefined()
	@Type(() => {
		return User;
	})
	@ValidateNested()
	public user!: User;
}

/**
 * Response for the 'update user' API
 */
export class UpdateUserResponse extends CommonResponse {

}
