import { Test, TestingModule } from "@nestjs/testing";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";
import { SportController } from "./sport.controller";
import { SportService } from "./sport.service";

describe("SportController", () => {
	let controller: SportController;
	let service: SportService;

	const mockSportService = {
		findAll: jest.fn(() => ["sport1", "sport2"]),
		findOne: jest.fn((id) => ({ id, name: "Football" })),
		createOne: jest.fn((dto) => ({ id: "1", ...dto })),
		updateOne: jest.fn((id, dto) => ({ id, ...dto })),
		deleteOne: jest.fn((id) => ({ affected: 1 })),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SportController],
			providers: [{ provide: SportService, useValue: mockSportService }],
		}).compile();

		controller = module.get<SportController>(SportController);
		service = module.get<SportService>(SportService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should return all sports", async () => {
		expect(await controller.findAll()).toEqual(["sport1", "sport2"]);
		expect(service.findAll).toHaveBeenCalled();
	});

	it("should return a single sport", async () => {
		expect(await controller.findOne("1")).toEqual({
			id: "1",
			name: "Football",
		});
		expect(service.findOne).toHaveBeenCalledWith("1");
	});

	it("should create a new sport", async () => {
		const dto: CreateSportDto = { name: "Basketball" };
		expect(await controller.createOne(dto)).toEqual({
			id: "1",
			name: "Basketball",
		});
		expect(service.createOne).toHaveBeenCalledWith(dto);
	});

	it("should update a sport", async () => {
		const dto: UpdateSportDto = { name: "Updated Sport" };
		expect(await controller.updateOne("1", dto)).toEqual({
			id: "1",
			name: "Updated Sport",
		});
		expect(service.updateOne).toHaveBeenCalledWith("1", dto);
	});

	it("should delete a sport", async () => {
		expect(await controller.deleteOne("1")).toEqual({ affected: 1 });
		expect(service.deleteOne).toHaveBeenCalledWith("1");
	});
});
