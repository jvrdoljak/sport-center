import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
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
	findAll() {
		return this.classesService.findAll();
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
	@UseGuards(JwtAuthGuard)
	createOne(@Body() createClassDto: CreateClassDto) {
		return this.classesService.createOne(createClassDto);
	}

	/**
	 * updateOne
	 */
	@Put(":id")
	@UseGuards(JwtAuthGuard)
	updateOne(@Param("id") id: string, @Body() updateClassDto: UpdateClassDto) {
		return this.classesService.updateOne(id, updateClassDto);
	}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	deleteOne(@Param("id") id: string) {
		return this.classesService.deleteOne(id);
	}
}
