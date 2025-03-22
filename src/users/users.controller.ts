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
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
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
	findAll() {
		return this.usersService.findAll();
	}

	/**
	 * Get user by id.
	 * @param id
	 * @returns
	 */
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.usersService.findOne(id);
	}

	/**
	 * Create user.
	 * @param user
	 * @returns
	 */
	@Post("create-user")
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
	updateOne(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(id, updateUserDto);
	}

	/**
	 * Delete self.
	 * @param req
	 * @returns
	 */
	@Delete("delete-self")
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
	deleteOne(@Param("id") id: string) {
		return this.usersService.deleteOne(id);
	}
}
