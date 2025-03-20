import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
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
	findAll() {
		return this.classesService.findAll();
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
	createOne(@Body() createClassDto: CreateClassDto) {
		return this.classesService.createOne(createClassDto);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	updateOne(@Param("id") id: string, @Body() updateClassDto: UpdateClassDto) {
		return this.classesService.updateOne(id, updateClassDto);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	deleteOne(@Param("id") id: string) {
		return this.classesService.deleteOne(id);
	}
}
