import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
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
	findAll(@Query("sports") sports?: string) {
		return this.classesService.findAll(sports);
	}

	/**
	 * findOne
	 */
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.classesService.findOne(id);
	}

	/**
	 * createOne
	 */
	@Post()
	@Roles(Role.Admin)
	createOne(@Body() createClassDto: CreateClassDto) {
		return this.classesService.createOne(createClassDto);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	@Roles(Role.Admin)
	updateOne(@Param("id") id: string, @Body() updateClassDto: UpdateClassDto) {
		return this.classesService.updateOne(id, updateClassDto);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	@Roles(Role.Admin)
	deleteOne(@Param("id") id: string) {
		return this.classesService.deleteOne(id);
	}
}
