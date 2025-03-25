import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SportService } from "src/sport/sport.service";
import { In, Repository } from "typeorm";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";
import { Class } from "./entities/class.entity";

@Injectable()
export class ClassService {
	constructor(
		@InjectRepository(Class)
		private classRepository: Repository<Class>,
		private sportService: SportService,
	) {}

	/**
	 * Find all classes..
	 * @param sports
	 * @returns
	 */
	async findAll(sports?: string): Promise<Array<Class>> {
		if (sports) {
			const sportNames = sports.split(",").map((s) => s.trim());
			return this.classRepository.find({
				relations: ["sport"],
				where: {
					sport: {
						name: In(sportNames),
					},
				},
			});
		}
		return await this.classRepository.find({
			relations: ["sport"],
		});
	}

	/**
	 * Find class identified by id.
	 * @param id
	 * @returns
	 */
	async findOne(id: string) {
		const existingClass = await this.classRepository.findOne({
			where: { id },
			relations: ["sport"],
		});

		if (!existingClass) {
			throw new NotFoundException(`Class with ID ${id} is not found.`);
		}

		return existingClass;
	}

	/**
	 * Create class.
	 * @param createClassDto
	 * @returns
	 */
	async createOne(createClassDto: CreateClassDto): Promise<Class> {
		// Verify that the sport exists
		await this.sportService.findOne(createClassDto.sportId);

		const createClass = this.classRepository.create(createClassDto);

		return await this.classRepository.save(createClass);
	}

	/**
	 * Update class identified by id.
	 * @param id
	 * @param updateClassDto
	 * @returns
	 */
	async updateOne(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
		const existingClass = await this.classRepository.findOneBy({ id });

		if (updateClassDto.sportId) {
			// Verify that the sport exists
			await this.findOne(updateClassDto.sportId);
		}

		if (!existingClass) {
			throw new NotFoundException(`Class with ID ${id} is not found.`);
		}

		Object.assign(existingClass, updateClassDto);
		return await this.classRepository.save(existingClass);
	}

	/**
	 * Delete class identified by id.
	 * @param id
	 */
	async deleteOne(id: string): Promise<void> {
		const result = await this.classRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Class with ID ${id} not found`);
		}
	}

	/**
	 * Check if class out of capacity.
	 * @param id
	 * @returns
	 */
	async checkAvailability(
		id: string,
	): Promise<{ available: boolean; capacity: number; enrolled: number }> {
		const sportClass = await this.findOne(id);
		const enrollmentCount = sportClass.enrollments?.length || 0;

		return {
			available: enrollmentCount < sportClass.capacity,
			capacity: sportClass.capacity,
			enrolled: enrollmentCount,
		};
	}
}
