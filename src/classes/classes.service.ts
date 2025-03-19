import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateClassDto } from "./dto/createClass.dto";
import { UpdateClassDto } from "./dto/updateClass.dto";
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
	async findAll(): Promise<Array<Class>> {
		return await this.classesRepository.find();
	}

	/**
	 * findOne
	 */
	async findOne(id: string) {
		const existingClass = await this.classesRepository.findOneBy({ id });

		if (!existingClass) {
			throw new NotFoundException(`Class with ID ${id} is not found.`);
		}

		return existingClass;
	}

	/**
	 * createOne
	 */
	async createOne(createClassDto: CreateClassDto): Promise<Class> {
		return await this.classesRepository.save(createClassDto);
	}

	/**
	 * updateOne
	 */
	async updateOne(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
		const existingClass = await this.classesRepository.findOneBy({ id });

		if (!existingClass) {
			throw new NotFoundException(`Class with ID ${id} is not found.`);
		}

		Object.assign(existingClass, updateClassDto);
		return await this.classesRepository.save(existingClass);
	}

	/**
	 * deleteOne
	 */
	async deleteOne(id: string): Promise<void> {
		const result = await this.classesRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Class with ID ${id} not found`);
		}
	}
}
