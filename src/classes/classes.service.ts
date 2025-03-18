import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Class } from "./entities/class.entity";

@Injectable()
export class ClassesService {
	constructor(
		@InjectRepository(Class)
		private classesRepository: Repository<Class>,
	) {}

	/**
	 * findAll
	 */
	findAll() {}

	/**
	 * findOne
	 */
	findOne() {}

	/**
	 * createOne
	 */
	createOne() {}

	/**
	 * updateOne
	 */
	updateOne() {}

	/**
	 * deleteOne
	 */
	deleteOne() {}
}
