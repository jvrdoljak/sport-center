import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "src/common/enums/role";
import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { SportService } from "src/sport/sport.service";
import { User } from "src/user/entitites/user.entity";
import { Repository } from "typeorm";
import { ClassService } from "./class.service";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";
import { Class } from "./entities/class.entity";

const mockSport = {
	id: "8013276f-d504-4373-a2de-aa7d006c07d8",
	name: "Football",
	classes: null,
	createdAt: new Date(),
	modifiedAt: new Date(),
};

const mockClass = {
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
	enrollments: null,
	createdAt: new Date(),
	modifiedAt: new Date(),
};

const mockUser: User = {
	id: "7af60664-b15d-4b1e-b924-98e0698e07f4",
	email: "test@test.com",
	role: Role.User,
	createdAt: new Date(),
	modifiedAt: new Date(),
	enrollments: null,
	password: "",
};

const mockEnrollment: Enrollment = {
	id: "13924acf-902b-42d7-a642-9300f43c7c80",
	userId: "7af60664-b15d-4b1e-b924-98e0698e07f4",
	classId: "999269b8-8cb4-4edd-920b-ccdf69ed45ez",
	user: mockUser,
	class: mockClass,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockUpdateClassDto: UpdateClassDto = {
	schedule: [
		{
			day: "Monday",
			startTime: "10:00",
			endTime: "12:00",
		},
		{
			day: "Wednesday",
			startTime: "14:00",
			endTime: "16:00",
		},
	],
	durationMins: 45,
	description: "Footballtraining",
	sportId: "8013276f-d504-4373-a2de-aa7d006c07d8",
	capacity: 10,
};

const mockCreateClassDto = mockUpdateClassDto as CreateClassDto;

describe("ClassService", () => {
	let classService: ClassService;
	let classRepository: Repository<Class>;
	let sportService: SportService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ClassService,
				{
					provide: getRepositoryToken(Class),
					useValue: {
						find: jest.fn(),
						findOne: jest.fn(),
						save: jest.fn(),
						create: jest.fn(),
						delete: jest.fn(),
					},
				},
				{
					provide: SportService,
					useValue: {
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		classService = module.get<ClassService>(ClassService);
		classRepository = module.get<Repository<Class>>(getRepositoryToken(Class));
		sportService = module.get<SportService>(SportService);
	});

	it("should be defined", () => {
		expect(classService).toBeDefined();
	});

	describe("findAll", () => {
		it("should return all classes", async () => {
			jest.spyOn(classRepository, "find").mockResolvedValue([mockClass]);

			const result = await classService.findAll();
			expect(result).toEqual([mockClass]);
		});

		it("should return classes filtered by sports", async () => {
			jest.spyOn(classRepository, "find").mockResolvedValue([mockClass]);

			const result = await classService.findAll("Football");
			expect(result).toEqual([mockClass]);
		});
	});

	describe("findOne", () => {
		it("should return a class by id", async () => {
			jest.spyOn(classRepository, "findOne").mockResolvedValue(mockClass);

			const result = await classService.findOne(mockClass.id);
			expect(result).toEqual(mockClass);
		});

		it("should throw an error if class is not found", async () => {
			jest.spyOn(classRepository, "findOne").mockResolvedValue(null);

			try {
				await classService.findOne(mockClass.id);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`Class with ID ${mockClass.id} is not found.`,
				);
			}
		});
	});

	describe("createOne", () => {
		it("should create a class", async () => {
			jest.spyOn(sportService, "findOne").mockResolvedValue(mockSport);
			jest.spyOn(classRepository, "create").mockReturnValue(mockClass);
			jest.spyOn(classRepository, "save").mockResolvedValue(mockClass);

			const result = await classService.createOne(mockCreateClassDto);
			expect(result).toEqual(mockClass);
		});

		it("should throw an error if sport does not exist", async () => {
			jest.spyOn(sportService, "findOne").mockResolvedValue(null);

			try {
				await classService.createOne(mockCreateClassDto);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`Sport with ID ${mockCreateClassDto.sportId} is not found.`,
				);
			}
		});
	});

	describe("updateOne", () => {
		it("should update a class", async () => {
			jest.spyOn(classService, "findOne").mockResolvedValue(mockClass);
			jest.spyOn(sportService, "findOne").mockResolvedValue(mockSport);
			jest
				.spyOn(classRepository, "save")
				.mockResolvedValue({ ...mockClass, ...mockUpdateClassDto });

			const result = await classService.updateOne(
				mockClass.id,
				mockUpdateClassDto,
			);
			expect(result.durationMins).toEqual(45);
			expect(result.capacity).toEqual(10);
		});

		it("should throw an error if class is not found", async () => {
			try {
				await classService.updateOne(mockClass.id, mockUpdateClassDto);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`Class with ID ${mockClass.id} is not found.`,
				);
			}
		});
	});

	describe("deleteOne", () => {
		it("should delete a class", async () => {
			const result = {
				raw: [],
				affected: 1,
			};

			jest.spyOn(classRepository, "delete").mockResolvedValue(result);

			await classService.deleteOne(mockClass.id);
			expect(classRepository.delete).toHaveBeenCalledWith(mockClass.id);
		});

		it("should throw an error if class is not found", async () => {
			const result = {
				raw: [],
				affected: 0,
			};
			jest.spyOn(classRepository, "delete").mockResolvedValue(result);

			try {
				await classService.deleteOne(mockClass.id);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(`Class with ID ${mockClass.id} not found`);
			}
		});
	});

	describe("checkAvailability", () => {
		it("should check if a class has availability", async () => {
			jest
				.spyOn(classService, "findOne")
				.mockResolvedValue({ ...mockClass, enrollments: [mockEnrollment] });

			const result = await classService.checkAvailability(mockClass.id);
			expect(result.available).toBe(true);
			expect(result.capacity).toBe(mockClass.capacity);
			expect(result.enrolled).toBe(1);
		});
	});
});
