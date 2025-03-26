import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "src/common/enums/role";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entitites/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
	let userService: UserService;
	let userRepository: Repository<User>;

	const mockUser: User = {
		id: "7af60664-b15d-4b1e-b924-98e0698e07f4",
		email: "test@example.com",
		role: Role.Admin,
		enrollments: null,
		createdAt: new Date(),
		modifiedAt: new Date(),
		password: "hashed",
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						find: jest.fn(),
						findOne: jest.fn(),
						findOneBy: jest.fn(),
						save: jest.fn(),
						create: jest.fn(),
						delete: jest.fn(),
						createQueryBuilder: jest.fn().mockReturnValue({
							addSelect: jest.fn().mockReturnThis(),
							where: jest.fn().mockReturnThis(),
							getOne: jest.fn(),
						}),
					},
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<Repository<User>>(getRepositoryToken(User));
	});

	it("should be defined", () => {
		expect(userService).toBeDefined();
	});

	describe("findAll", () => {
		it("should return all users", async () => {
			jest.spyOn(userRepository, "find").mockResolvedValue([mockUser]);

			const result = await userService.findAll();
			expect(result).toEqual([mockUser]);
		});
	});

	describe("findOne", () => {
		it("should return a user by id", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			const result = await userService.findOne("1");
			expect(result).toEqual(mockUser);
		});

		it("should throw NotFoundException if user is not found", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

			await expect(userService.findOne("1")).rejects.toThrow(
				new NotFoundException("User with ID 1 not found"),
			);
		});
	});

	describe("findByEmail", () => {
		it("should return a user by email", async () => {
			const mockUser1 = { ...mockUser, password: "hashed" };
			jest
				.spyOn(userRepository.createQueryBuilder(), "getOne")
				.mockResolvedValue(mockUser1);

			const result = await userService.findByEmail("test@example.com");
			expect(result).toEqual(mockUser1);
		});

		it("should return null if user is not found", async () => {
			jest
				.spyOn(userRepository.createQueryBuilder(), "getOne")
				.mockResolvedValue(null);

			const result = await userService.findByEmail("test@example.com");
			expect(result).toBeNull();
		});
	});

	describe("createOne", () => {
		it("should create a new user", async () => {
			const createUserDto = {
				...mockUser,
				email: "test@example.com",
				password: "123456A!a",
			};
			const userAfterCreate = { ...createUserDto, password: "hashed" };

			jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
			jest.spyOn(userRepository, "create").mockReturnValue(userAfterCreate);
			jest.spyOn(userRepository, "save").mockResolvedValue(userAfterCreate);

			const result = await userService.createOne(createUserDto);
			expect(result).toEqual(userAfterCreate);
		});

		it("should throw ConflictException if email already exists", async () => {
			const createUserDto: CreateUserDto = {
				email: "test@example.com",
				password: "123456A!a",
			};
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			await expect(userService.createOne(createUserDto)).rejects.toThrow(
				new ConflictException("Email already exists"),
			);
		});
	});

	describe("updateOne", () => {
		it("should update an existing user", async () => {
			const updateUserDto = { password: "newpassword" };

			jest.spyOn(userRepository, "findOneBy").mockResolvedValue(mockUser);
			jest.spyOn(userRepository, "save").mockResolvedValue({
				...mockUser,
				password: "newhashed",
			});

			const result = await userService.updateOne(
				"7af60664-b15d-4b1e-b924-98e0698e07f4",
				updateUserDto,
			);
			expect(result.password).toEqual("newhashed");
		});

		it("should throw NotFoundException if user does not exist", async () => {
			jest.spyOn(userRepository, "findOneBy").mockResolvedValue(null);

			await expect(
				userService.updateOne("7af60664-b15d-4b1e-b924-98e0698e07f4", {
					password: "newpassword",
				}),
			).rejects.toThrow(
				new NotFoundException(
					"User with ID 7af60664-b15d-4b1e-b924-98e0698e07f4 not found",
				),
			);
		});
	});

	describe("deleteOne", () => {
		it("should delete a user", async () => {
			const result = {
				raw: [],
				affected: 1,
			};
			jest.spyOn(userRepository, "delete").mockResolvedValue(result);

			await expect(
				userService.deleteOne("7af60664-b15d-4b1e-b924-98e0698e07f4"),
			).resolves.not.toThrow();
		});

		it("should throw NotFoundException if user is not found", async () => {
			const result = {
				raw: [],
				affected: 0,
			};
			jest.spyOn(userRepository, "delete").mockResolvedValue(result);

			await expect(
				userService.deleteOne("7af60664-b15d-4b1e-b924-98e0698e07f4"),
			).rejects.toThrow(
				new NotFoundException(
					"User with ID 7af60664-b15d-4b1e-b924-98e0698e07f4 not found",
				),
			);
		});
	});

	describe("createInitialAccount", () => {
		it("should create an initial admin account if it does not exist", async () => {
			const createUserDto: CreateUserDto = {
				email: "admin@example.com",
				password: "adminpass",
			};

			jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
			jest.spyOn(userRepository, "create").mockReturnValue(mockUser);
			jest.spyOn(userRepository, "save").mockResolvedValue(mockUser);

			const result = await userService.createInitialAccount(createUserDto);
			expect(result).toEqual(mockUser);
		});

		it("should return null if admin already exists", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			const result = await userService.createInitialAccount({
				email: "test@example.com",
				password: "adminpass",
			});
			expect(result).toBeNull();
		});
	});
});
