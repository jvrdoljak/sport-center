import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/common/enums/role";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
	let controller: UserController;
	let service: UserService;

	const mockUserService = {
		findAll: jest.fn(() => ["user1", "user2"]),
		findOne: jest.fn((id) => ({ id, name: "John Doe" })),
		createOne: jest.fn((dto, role = Role.User) => ({ id: "1", ...dto, role })),
		updateOne: jest.fn((id, dto) => ({ id, ...dto })),
		deleteOne: jest.fn((id) => ({ affected: 1 })),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [{ provide: UserService, useValue: mockUserService }],
		}).compile();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should return all users", async () => {
		expect(await controller.findAll()).toEqual(["user1", "user2"]);
		expect(service.findAll).toHaveBeenCalled();
	});

	it("should return a single user", async () => {
		expect(await controller.findOne("1")).toEqual({
			id: "1",
			name: "John Doe",
		});
		expect(service.findOne).toHaveBeenCalledWith("1");
	});

	it("should create a new user", async () => {
		const dto: CreateUserDto = {
			email: "test@example.com",
			password: "pass123",
		};
		expect(await controller.createUser(dto)).toEqual({
			id: "1",
			email: "test@example.com",
			password: "pass123",
			role: Role.User,
		});
		expect(service.createOne).toHaveBeenCalledWith(dto);
	});

	it("should create a new admin user", async () => {
		const dto: CreateUserDto = {
			email: "admin@example.com",
			password: "adminpass",
		};
		expect(await controller.createAdmin(dto)).toEqual({
			id: "1",
			email: "admin@example.com",
			password: "adminpass",
			role: Role.Admin,
		});
		expect(service.createOne).toHaveBeenCalledWith(dto, Role.Admin);
	});

	it("should update self", async () => {
		const req = { user: { id: "1" } };
		const dto: UpdateUserDto = { email: "new@example.com" };
		expect(await controller.updateSelf(req, dto)).toEqual({
			id: "1",
			email: "new@example.com",
		});
		expect(service.updateOne).toHaveBeenCalledWith("1", dto);
	});

	it("should update another user", async () => {
		const dto: UpdateUserDto = { email: "updated@example.com" };
		expect(await controller.updateOne("2", dto)).toEqual({
			id: "2",
			email: "updated@example.com",
		});
		expect(service.updateOne).toHaveBeenCalledWith("2", dto);
	});

	it("should delete self", async () => {
		const req = { user: { id: "1" } };
		expect(await controller.deleteSelf(req)).toEqual({ affected: 1 });
		expect(service.deleteOne).toHaveBeenCalledWith("1");
	});

	it("should delete a user", async () => {
		expect(await controller.deleteOne("2")).toEqual({ affected: 1 });
		expect(service.deleteOne).toHaveBeenCalledWith("2");
	});
});
