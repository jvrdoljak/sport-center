import { Controller, Delete, Get, Post } from "@nestjs/common";
import { ClassesService } from "./classes.service";

@Controller("classes")
export class ClassesController {
	constructor(private readonly classesService: ClassesService) {}

	/**
	 * findAll
	 */
	@Get()
	findAll() {}

	/**
	 * findOne
	 */
	@Get(":id")
	findOne() {}

	/**
	 * createOne
	 */
	@Post()
	createOne() {}

	/**
	 * updateOne
	 */
	@Post(":id")
	updateOne() {}

	/**
	 * deleteOne
	 */
	@Delete(":id")
	deleteOne() {}
}
