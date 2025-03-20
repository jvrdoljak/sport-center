import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSportDto } from "./dto/createSport.dto";
import { UpdateSportDto } from "./dto/updateSport.dto";
import { Sport } from "./entities/sport.entity";

@Injectable()
export class SportsService {
	constructor(
		@InjectRepository(Sport)
		private sportRepository: Repository<Sport>,
	) {}

	async findAll(): Promise<Array<Sport>> {
		return await this.sportRepository.find();
	}

	async findOne(id: string): Promise<Sport> {
		const sport = await this.sportRepository.findOneBy({ id });

		if (!sport) {
			throw new NotFoundException(`Sport with ID: ${id} is not found`);
		}

		return sport;
	}

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

	async updateOne(id: string, updateSportDto: UpdateSportDto): Promise<Sport> {
		const existingSport = await this.sportRepository.findOneBy({ id });

		if (!existingSport) {
			throw new NotFoundException(`Sport with id: ${id} doesn't exist.`);
		}

		Object.assign(existingSport, updateSportDto);

		return await this.sportRepository.save(existingSport);
	}

	async deleteOne(id: string): Promise<void> {
		const result = await this.sportRepository.delete({ id });

		if (result.affected === 0) {
			throw new NotFoundException(`Sport with ID ${id} not found`);
		}
	}
}
