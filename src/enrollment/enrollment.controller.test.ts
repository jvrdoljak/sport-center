import { Test, TestingModule } from "@nestjs/testing";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";

describe("EnrollmentController", () => {
	let controller: EnrollmentController;
	let service: EnrollmentService;

	const mockEnrollmentService = {
		create: jest.fn((userId, dto) => ({ id: "1", userId, ...dto })),
		findAll: jest.fn(() => ["enrollment1", "enrollment2"]),
		findByUser: jest.fn((userId) => [`enrollment for user ${userId}`]),
		findByClass: jest.fn((classId) => [`enrollment for class ${classId}`]),
		delete: jest.fn((id, userId) => ({ id, userId, deleted: true })),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EnrollmentController],
			providers: [
				{ provide: EnrollmentService, useValue: mockEnrollmentService },
			],
		}).compile();

		controller = module.get<EnrollmentController>(EnrollmentController);
		service = module.get<EnrollmentService>(EnrollmentService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should create an enrollment", async () => {
		const req = { user: { id: "123" } };
		const dto: CreateEnrollmentDto = { classId: "456" };
		expect(await controller.create(req, dto)).toEqual({
			id: "1",
			userId: "123",
			classId: "456",
		});
		expect(service.create).toHaveBeenCalledWith("123", dto);
	});

	it("should return all enrollments", async () => {
		expect(await controller.findAll()).toEqual(["enrollment1", "enrollment2"]);
		expect(service.findAll).toHaveBeenCalled();
	});

	it("should return enrollments for the requesting user", async () => {
		const req = { user: { id: "789" } };
		expect(await controller.findMyEnrollments(req)).toEqual([
			"enrollment for user 789",
		]);
		expect(service.findByUser).toHaveBeenCalledWith("789");
	});

	it("should return enrollments for a specific class", async () => {
		expect(await controller.findByClass("101")).toEqual([
			"enrollment for class 101",
		]);
		expect(service.findByClass).toHaveBeenCalledWith("101");
	});

	it("should delete an enrollment", async () => {
		const req = { user: { id: "123" } };
		expect(await controller.delete("999", req)).toEqual({
			id: "999",
			userId: "123",
			deleted: true,
		});
		expect(service.delete).toHaveBeenCalledWith("999", "123");
	});
});
