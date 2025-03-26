import {
	BadRequestException,
	ConflictException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Class } from "src/class/entities/class.entity";
import { Repository } from "typeorm";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";
import { Sport } from "./entities/sport.entity";
import { SportService } from "./sport.service";

const mockSport: Sport = {
	id: "8013276f-d504-4373-a2de-aa7d006c07d8",
	name: "Football",
	createdAt: new Date(),
	modifiedAt: new Date(),
	classes: null,
};

const mockClass: Class = {
	id: "999269b8-8cb4-4edd-920b-ccdf69ed45ed",
	schedule: [
		{
			day: "Monday",
			endTime: "12:00",
			startTime: "10:00",
		},
		{
			day: "Wednesday",
			endTime: "16:00",
			startTime: "14:00",
		},
	],
	durationMins: 60,
	description: "Footballtraining",
	capacity: 10,
	sportId: "8013276f-d504-4373-a2de-aa7d006c07d8",
	sport: mockSport,
	createdAt: new Date(),
	modifiedAt: new Date(),
	enrollments: null,
};

const mockClassSport = {
	id: "8013276f-d504-4373-a2de-aa7d006c07d8",
	name: "Football",
	classes: [mockClass],
	createdAt: new Date(),
	modifiedAt: new Date(),
};

describe("SportService", () => {
	let service: SportService;
	let repository: Repository<Sport>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SportService,
				{
					provide: getRepositoryToken(Sport),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<SportService>(SportService);
		repository = module.get<Repository<Sport>>(getRepositoryToken(Sport));
	});

	describe("findAll", () => {
		it("should return an array of sports", async () => {
			jest.spyOn(repository, "find").mockResolvedValue([mockSport]);

			expect(await service.findAll()).toStrictEqual([mockSport]);
		});
	});

	describe("findOne", () => {
		it("should return a sport by id", async () => {
			jest.spyOn(repository, "findOne").mockResolvedValue(mockSport);

			expect(await service.findOne(mockSport.id)).toStrictEqual(mockSport);
		});

		it("should throw an error if sport is not found", async () => {
			jest.spyOn(repository, "findOne").mockResolvedValue(null);

			try {
				await service.findOne(mockSport.id);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					`Sport with ID: ${mockSport.id} is not found`,
				);
			}
		});
	});

	describe("createOne", () => {
		it("should create a new sport", async () => {
			const createSportDto: CreateSportDto = { name: "Football" };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(null);
			jest.spyOn(repository, "create").mockReturnValue(mockSport);
			jest.spyOn(repository, "save").mockResolvedValue(mockSport);

			expect(await service.createOne(createSportDto)).toBe(mockSport);
		});

		it("should throw ConflictException if sport already exists", async () => {
			const createSportDto: CreateSportDto = { name: "Football" };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(mockSport);

			try {
				await service.createOne(createSportDto);
			} catch (e) {
				expect(e).toBeInstanceOf(ConflictException);
				expect(e.response.message).toBe(
					`Sport named: ${createSportDto.name} already exists.`,
				);
			}
		});
	});

	describe("updateOne", () => {
		it("should update a sport", async () => {
			const updateSportDto: UpdateSportDto = { name: "Updated Football" };
			const updatedSport = { ...mockSport, ...updateSportDto };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(mockSport);
			jest.spyOn(repository, "save").mockResolvedValue(updatedSport);

			expect(await service.updateOne(mockSport.id, updateSportDto)).toBe(
				updatedSport,
			);
		});

		it("should throw NotFoundException if sport not found", async () => {
			const updateSportDto: UpdateSportDto = { name: "Updated Football" };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(null);

			try {
				await service.updateOne(mockSport.id, updateSportDto);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					`Sport with id: ${mockSport.id} doesn't exist.`,
				);
			}
		});
	});

	describe("deleteOne", () => {
		it("should delete a sport", async () => {
			const result = {
				raw: [],
				affected: 1,
			};

			jest.spyOn(service, "findOne").mockResolvedValue(mockSport);
			jest.spyOn(repository, "delete").mockResolvedValue(result);

			await service.deleteOne(mockSport.id);
			expect(repository.delete).toHaveBeenCalledWith({
				id: mockSport.id,
			});
		});

		it("should throw BadRequestException if sport has active classes", async () => {
			jest.spyOn(service, "findOne").mockResolvedValue(mockClassSport);

			try {
				await service.deleteOne(mockClassSport.id);
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException);
				expect(e.response.message).toBe(
					`Sport with ID: ${mockClassSport.id} has active classes.`,
				);
			}
		});

		it("should throw NotFoundException if sport not found", async () => {
			jest.spyOn(service, "findOne").mockResolvedValue(null);

			try {
				await service.deleteOne(mockSport.id);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					`Sport with ID ${mockSport.id} not found`,
				);
			}
		});
	});
});
