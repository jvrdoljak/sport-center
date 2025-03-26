import {
	BadRequestException,
	ConflictException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ClassService } from "src/class/class.service";
import { Class } from "src/class/entities/class.entity";
import { Role } from "src/common/enums/role";
import { Sport } from "src/sport/entities/sport.entity";
import { User } from "src/user/entitites/user.entity";
import { Repository } from "typeorm";
import { EnrollmentService } from "./enrollment.service";
import { Enrollment } from "./entities/enrollment.entity";

const mockEnrollmentRepository = {
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
	delete: jest.fn(),
};

const mockClassService = {
	findOne: jest.fn(),
	checkAvailability: jest.fn(),
};

const mockUser: User = {
	id: "7af60664-b15d-4b1e-b924-98e0698e07f4",
	email: "test@example.com",
	role: Role.User,
	enrollments: null,
	createdAt: new Date(),
	modifiedAt: new Date(),
	password: "hashed",
};

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

const mockEnrollment: Enrollment = {
	id: "13924acf-902b-42d7-a642-9300f43c7c80",
	userId: "7af60664-b15d-4b1e-b924-98e0698e07f4",
	classId: "999269b8-8cb4-4edd-920b-ccdf69ed45ed",
	user: mockUser,
	class: mockClass,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("EnrollmentService", () => {
	let service: EnrollmentService;
	let repository: Repository<Enrollment>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EnrollmentService,
				{
					provide: getRepositoryToken(Enrollment),
					useValue: mockEnrollmentRepository,
				},
				{ provide: ClassService, useValue: mockClassService },
			],
		}).compile();

		service = module.get<EnrollmentService>(EnrollmentService);
		repository = module.get<Repository<Enrollment>>(
			getRepositoryToken(Enrollment),
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create an enrollment successfully", async () => {
			mockClassService.findOne.mockResolvedValue({});
			mockClassService.checkAvailability.mockResolvedValue({ available: true });
			mockEnrollmentRepository.findOne.mockResolvedValue(null);
			mockEnrollmentRepository.create.mockReturnValue(mockEnrollment);
			mockEnrollmentRepository.save.mockResolvedValue(mockEnrollment);

			const result = await service.create(mockUser.id, {
				classId: mockClass.id,
			});
			expect(result).toEqual(mockEnrollment);
		});

		it("should throw ConflictException if user is already enrolled", async () => {
			mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

			await expect(
				service.create(mockUser.id, { classId: mockClass.id }),
			).rejects.toThrow(ConflictException);
		});

		it("should throw BadRequestException if class is full", async () => {
			mockEnrollmentRepository.findOne.mockResolvedValue(null);
			mockClassService.checkAvailability.mockResolvedValue({
				available: false,
			});

			await expect(
				service.create("second-user-id", { classId: mockClass.id }),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe("findAll", () => {
		it("should return all enrollments", async () => {
			mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
			const result = await service.findAll();
			expect(result).toEqual([mockEnrollment]);
		});
	});

	describe("findOne", () => {
		it("should return an enrollment if found", async () => {
			mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
			const result = await service.findOne(mockUser.id);
			expect(result).toEqual(mockEnrollment);
		});

		it("should throw NotFoundException if enrollment not found", async () => {
			mockEnrollmentRepository.findOne.mockResolvedValue(null);
			await expect(service.findOne(mockEnrollment.id)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("delete", () => {
		it("should delete an enrollment", async () => {
			const result = {
				raw: [],
				affected: 1,
			};
			mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
			mockEnrollmentRepository.delete.mockResolvedValue(result);

			await expect(
				service.delete(mockEnrollment.id, mockUser.id),
			).resolves.toBe(result);
		});

		it("should throw BadRequestException if enrollment does not belong to user", async () => {
			mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

			await expect(
				service.delete(mockEnrollment.id, "another-user-id"),
			).rejects.toThrow(BadRequestException);
		});
	});
});
