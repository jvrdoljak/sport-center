import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
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
	findAll() {
		return this.usersService.findAll();
	}

	/**
	 * findOne
	 */
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.usersService.findOne(id);
	}

	/**
	 * createOne
	 */
	@Post()
	createOne(@Body() user: CreateUserDto) {
		return this.usersService.createOne(user);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	updateOne(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateOne(id, updateUserDto);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	deleteOne(@Param("id") id: string) {
		return this.usersService.deleteOne(id);
	}
}
