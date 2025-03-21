import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ClassesService } from "./classes.service";
import { CreateClassDto } from "./dto/createClass.dto";
import { UpdateClassDto } from "./dto/updateClass.dto";

@Controller("classes")
export class ClassesController {
	constructor(private readonly classesService: ClassesService) {}

	/**
	 * findAll
	 */
	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Query('sports') sports?:string) {
		return this.classesService.findAll(sports);
	}

	/**
	 * findOne
	 */
	@Get(":id")
	@UseGuards(JwtAuthGuard)
	findOne(@Param("id") id: string) {
		return this.classesService.findOne(id);
	}

	/**
	 * createOne
	 */
	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	createOne(@Body() createClassDto: CreateClassDto) {
		return this.classesService.createOne(createClassDto);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	updateOne(@Param("id") id: string, @Body() updateClassDto: UpdateClassDto) {
		return this.classesService.updateOne(id, updateClassDto);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	deleteOne(@Param("id") id: string) {
		return this.classesService.deleteOne(id);
	}
}
