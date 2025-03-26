import {
	BadRequestException,
	ConflictException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";
import { Sport } from "./entities/sport.entity";
import { SportService } from "./sport.service";

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
			const result = [
				{
					id: "8013276f-d504-4373-a2de-aa7d006c07d8",
					name: "Football",
					classes: [],
					createdAt: new Date(),
					modifiedAt: new Date(),
				},
			];
			jest.spyOn(repository, "find").mockResolvedValue(result);

			expect(await service.findAll()).toBe(result);
		});
	});

	describe("findOne", () => {
		it("should return a sport by id", async () => {
			const result = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			jest.spyOn(repository, "findOne").mockResolvedValue(result);

			expect(
				await service.findOne("8013276f-d504-4373-a2de-aa7d006c07d8"),
			).toBe(result);
		});

		it("should throw an error if sport is not found", async () => {
			jest.spyOn(repository, "findOne").mockResolvedValue(null);

			try {
				await service.findOne("8013276f-d504-4373-a2de-aa7d006c07d8");
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					"Sport with ID: 8013276f-d504-4373-a2de-aa7d006c07d8 is not found",
				);
			}
		});
	});

	describe("createOne", () => {
		it("should create a new sport", async () => {
			const createSportDto: CreateSportDto = { name: "Football" };
			const result = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			jest.spyOn(repository, "findOneBy").mockResolvedValue(null);
			jest.spyOn(repository, "create").mockReturnValue(result);
			jest.spyOn(repository, "save").mockResolvedValue(result);

			expect(await service.createOne(createSportDto)).toBe(result);
		});

		it("should throw ConflictException if sport already exists", async () => {
			const createSportDto: CreateSportDto = { name: "Football" };
			const existingSport = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			jest.spyOn(repository, "findOneBy").mockResolvedValue(existingSport);

			try {
				await service.createOne(createSportDto);
			} catch (e) {
				expect(e).toBeInstanceOf(ConflictException);
				expect(e.response.message).toBe(
					"Sport named: Football already exists.",
				);
			}
		});
	});

	describe("updateOne", () => {
		it("should update a sport", async () => {
			const updateSportDto: UpdateSportDto = { name: "Updated Football" };
			const existingSport = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			const updatedSport = { ...existingSport, ...updateSportDto };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(existingSport);
			jest.spyOn(repository, "save").mockResolvedValue(updatedSport);

			expect(
				await service.updateOne(
					"8013276f-d504-4373-a2de-aa7d006c07d8",
					updateSportDto,
				),
			).toBe(updatedSport);
		});

		it("should throw NotFoundException if sport not found", async () => {
			const updateSportDto: UpdateSportDto = { name: "Updated Football" };
			jest.spyOn(repository, "findOneBy").mockResolvedValue(null);

			try {
				await service.updateOne(
					"8013276f-d504-4373-a2de-aa7d006c07d8",
					updateSportDto,
				);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					"Sport with id: 8013276f-d504-4373-a2de-aa7d006c07d8 doesn't exist.",
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
			const sport = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			jest.spyOn(service, "findOne").mockResolvedValue(sport);
			jest.spyOn(repository, "delete").mockResolvedValue(result);

			await service.deleteOne("8013276f-d504-4373-a2de-aa7d006c07d8");
			expect(repository.delete).toHaveBeenCalledWith({
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
			});
		});

		it("should throw BadRequestException if sport has active classes", async () => {
			const sportFromClass = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};
			const sport: Sport = {
				id: "8013276f-d504-4373-a2de-aa7d006c07d8",
				name: "Football",
				classes: [
					{
						id: "999269b8-8cb4-4edd-920b-ccdf69ed45ed",
						sport: sportFromClass,
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
						enrollments: null,
						durationMins: 60,
						description: "Footballtraining",
						capacity: 10,
						sportId: "8013276f-d504-4373-a2de-aa7d006c07d8",
						createdAt: new Date(),
						modifiedAt: new Date(),
					},
				],
				createdAt: new Date(),
				modifiedAt: new Date(),
			};

			jest.spyOn(service, "findOne").mockResolvedValue(sport);

			try {
				await service.deleteOne("8013276f-d504-4373-a2de-aa7d006c07d8");
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException);
				expect(e.response.message).toBe(
					"Sport with ID: 8013276f-d504-4373-a2de-aa7d006c07d8 has active classes.",
				);
			}
		});

		it("should throw NotFoundException if sport not found", async () => {
			jest.spyOn(service, "findOne").mockResolvedValue(null);

			try {
				await service.deleteOne("8013276f-d504-4373-a2de-aa7d006c07d8");
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.response.message).toBe(
					"Sport with ID 8013276f-d504-4373-a2de-aa7d006c07d8 not found",
				);
			}
		});
	});
});
