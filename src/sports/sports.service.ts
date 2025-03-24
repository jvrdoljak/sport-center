import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";
import { Sport } from "./entities/sport.entity";

@Injectable()
export class SportsService {
	constructor(
		@InjectRepository(Sport)
		private sportRepository: Repository<Sport>,
	) {}
	/**
	 * Find all sports.
	 * @returns
	 */
	async findAll(): Promise<Array<Sport>> {
		return await this.sportRepository.find({
			relations: ["classes"],
		});
	}
	/**
	 * Find one sport identified by id.
	 * @param id
	 * @returns
	 */
	async findOne(id: string): Promise<Sport> {
		const sport = await this.sportRepository.findOne({
			where: { id },
			relations: ["classes"],
		});

		if (!sport) {
			throw new NotFoundException(`Sport with ID: ${id} is not found`);
		}

		return sport;
	}
	/**
	 * Create new sport.
	 * @param createSportDto
	 * @returns
	 */
	async createOne(createSportDto: CreateSportDto): Promise<Sport> {
		const existingSport = await this.sportRepository.findOneBy({
			name: createSportDto.name,
		});

		if (existingSport) {
			throw new ConflictException(
				`Sport named: ${createSportDto.name} already exists.`,
			);
		}

		const newSport = this.sportRepository.create(createSportDto);

		return await this.sportRepository.save(newSport);
	}
	/**
	 * Update sport idenfitied by id.
	 * @param id
	 * @param updateSportDto
	 * @returns
	 */
	async updateOne(id: string, updateSportDto: UpdateSportDto): Promise<Sport> {
		const existingSport = await this.sportRepository.findOneBy({ id });

		if (!existingSport) {
			throw new NotFoundException(`Sport with id: ${id} doesn't exist.`);
		}

		Object.assign(existingSport, updateSportDto);

		return await this.sportRepository.save(existingSport);
	}
	/**
	 * Delete sport identified by id.
	 * @param id
	 */
	async deleteOne(id: string): Promise<void> {
		const sport = await this.findOne(id);

		if (!sport) {
			throw new NotFoundException(`Sport with ID ${id} not found`);
		}

		if (sport.classes.length > 0) {
			throw new BadRequestException(`Sport with ID: ${id} has active classes.`);
		}

		const result = await this.sportRepository.delete({ id });

		if (result.affected === 0) {
			throw new NotFoundException(`Sport with ID ${id} not found`);
		}
	}
}
