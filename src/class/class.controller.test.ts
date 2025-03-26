import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/common/enums/role";
import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { User } from "src/user/entitites/user.entity";
import { ClassController } from "./class.controller";
import { ClassService } from "./class.service";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";

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

const mockCreateClassDto: CreateClassDto = {
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
	durationMins: 60,
	description: "Footballtraining",
	sportId: "8013276f-d504-4373-a2de-aa7d006c07d8",
	capacity: 10,
};

describe("ClassController", () => {
	let controller: ClassController;
	let service: ClassService;

	const mockClassService = {
		findAll: jest.fn((sports) =>
			sports ? [mockClass] : [{ ...mockClass, sport: "NotFootball" }],
		),
		findOne: jest.fn((id) => ({ ...mockClass, id })),
		createOne: jest.fn((dto) => ({ ...mockClass, ...dto })),
		updateOne: jest.fn((id, dto) => ({ ...mockClass, ...dto })),
		deleteOne: jest.fn((id) => ({ affected: 1 })),
		checkAvailability: jest.fn((id) => ({
			available: true,
			capacity: mockClass.capacity,
			enrolled: 0,
		})),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClassController],
			providers: [{ provide: ClassService, useValue: mockClassService }],
		}).compile();

		controller = module.get<ClassController>(ClassController);
		service = module.get<ClassService>(ClassService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should return all classes", async () => {
		expect(await controller.findAll()).toEqual([
			{ ...mockClass, sport: "NotFootball" },
		]);
		expect(service.findAll).toHaveBeenCalled();
	});

	it("should return filtered classes", async () => {
		expect(await controller.findAll(mockSport.name)).toEqual([mockClass]);
		expect(service.findAll).toHaveBeenCalledWith(mockSport.name);
	});

	it("should return a single class", async () => {
		expect(await controller.findOne(mockClass.id)).toEqual(mockClass);
		expect(service.findOne).toHaveBeenCalledWith(mockClass.id);
	});

	it("should create a new class", async () => {
		expect(await controller.createOne(mockCreateClassDto)).toEqual(mockClass);
		expect(service.createOne).toHaveBeenCalledWith(mockCreateClassDto);
	});

	it("should update a class", async () => {
		expect(
			await controller.updateOne(mockClass.id, mockUpdateClassDto),
		).toEqual({ ...mockClass, ...mockUpdateClassDto });
		expect(service.updateOne).toHaveBeenCalledWith(
			mockClass.id,
			mockUpdateClassDto,
		);
	});

	it("should delete a class", async () => {
		expect(await controller.deleteOne(mockClass.id)).toEqual({ affected: 1 });
		expect(service.deleteOne).toHaveBeenCalledWith(mockClass.id);
	});

	it("should check class availability", async () => {
		expect(await controller.checkAvailability(mockClass.id)).toEqual({
			available: true,
			capacity: mockClass.capacity,
			enrolled: 0,
		});
		expect(service.checkAvailability).toHaveBeenCalledWith(mockClass.id);
	});
});
