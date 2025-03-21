import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * findAll
	 */
	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	findAll() {
		return this.usersService.findAll();
	}

	/**
	 * findOne
	 */
	@Get(":id")
	@UseGuards(JwtAuthGuard)
	findOne(@Param("id") id: string) {
		return this.usersService.findOne(id);
	}

	/**
	 * createUser
	 */
	@Post("create-user")
	createUser(@Body() user: CreateUserDto) {
		return this.usersService.createOne(user);
	}

	/**
	 * createAdmin
	 */
	@Post("create-admin")
	@UseGuards(JwtAuthGuard)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	createAdmin(@Body() user: CreateUserDto) {
		return this.usersService.createOne(user, Role.Admin);
	}

	/**
	 * updateSelf
	 */
	@Put("update-self")
	@UseGuards(JwtAuthGuard)
	updateSelf(@Req() req, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(req.user.id, updateUserDto);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	updateOne(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(id, updateUserDto);
	}

	/**
	 * deleteSelf
	 */
	@Delete("delete-self")
	@UseGuards(JwtAuthGuard)
	deleteSelf(@Req() req) {
		return this.usersService.deleteOne(req.user.id);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	deleteOne(@Param("id") id: string) {
		return this.usersService.deleteOne(id);
	}
}
