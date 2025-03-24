import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * Get all users.
	 * @returns
	 */
	@Get()
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Get all users (Admin only)" })
	@ApiResponse({ status: 200, description: "Return all users." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	findAll() {
		return this.usersService.findAll();
	}

	/**
	 * Get user by id.
	 * @param id
	 * @returns
	 */
	@Get(":id")
	@ApiOperation({ summary: "Get a user by id (Admin only)" })
	@ApiResponse({ status: 200, description: "Return the user." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "User not found." })
	findOne(@Param("id") id: string) {
		return this.usersService.findOne(id);
	}

	/**
	 * Create user.
	 * @param user
	 * @returns
	 */
	@Post("create-user")
	@ApiOperation({ summary: "Create a new user" })
	@ApiResponse({ status: 201, description: "User successfully created." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 409, description: "Email already exists." })
	createUser(@Body() user: CreateUserDto) {
		return this.usersService.createOne(user);
	}

	/**
	 * Create admin user.
	 * @param user
	 * @returns
	 */
	@Post("create-admin")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Create a new admin user" })
	@ApiResponse({ status: 201, description: "User successfully created." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 409, description: "Email already exists." })
	createAdmin(@Body() user: CreateUserDto) {
		return this.usersService.createOne(user, Role.Admin);
	}

	/**
	 * Update self.
	 * @param req
	 * @param updateUserDto
	 * @returns
	 */
	@Put("update-self")
	@ApiOperation({ summary: "Update self." })
	@ApiResponse({ status: 200, description: "User successfully updated." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "User not found." })
	updateSelf(@Req() req, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(req.user.id, updateUserDto);
	}

	/**
	 * Update another user.
	 * @param id
	 * @param updateUserDto
	 * @returns
	 */
	@Put(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Update another user (Admin only)" })
	@ApiResponse({ status: 200, description: "User successfully updated." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "User not found." })
	updateOne(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(id, updateUserDto);
	}

	/**
	 * Delete self.
	 * @param req
	 * @returns
	 */
	@Delete("delete-self")
	@ApiOperation({ summary: "Delete self" })
	@ApiResponse({ status: 200, description: "User successfully deleted." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "User not found." })
	deleteSelf(@Req() req) {
		return this.usersService.deleteOne(req.user.id);
	}

	/**
	 * Delete user by id.
	 * @param id
	 * @returns
	 */
	@Delete(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Delete a user by id (Admin only)" })
	@ApiResponse({ status: 200, description: "User successfully deleted." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "User not found." })
	deleteOne(@Param("id") id: string) {
		return this.usersService.deleteOne(id);
	}
}
