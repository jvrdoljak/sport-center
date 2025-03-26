import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/common/enums/role";
import { User } from "src/user/entitites/user.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let authService: AuthService;
	let userService: UserService;
	let jwtService: JwtService;

	const mockUser: User = {
		id: "7af60664-b15d-4b1e-b924-98e0698e07f4",
		email: "test@example.com",
		role: Role.User,
		enrollments: null,
		createdAt: new Date(),
		modifiedAt: new Date(),
		password: "hashed",
	};

	beforeEach(() => {
		userService = {
			findByEmail: jest.fn(),
			createOne: jest.fn(),
		} as any;

		jwtService = {
			sign: jest.fn().mockReturnValue("mocked_jwt_token"),
		} as any;

		authService = new AuthService(userService, jwtService);
	});

	describe("validateUser", () => {
		it("should return null if credentials are invalid", async () => {
			jest.spyOn(userService, "findByEmail").mockResolvedValue(null);

			const result = await authService.validateUser(
				"test@example.com",
				"password",
			);
			expect(result).toBeNull();
		});
	});

	describe("login", () => {
		it("should return access token and user if credentials are valid", async () => {
			jest.spyOn(authService, "validateUser").mockResolvedValue({
				...mockUser,
				email: "test@example.com",
				role: "User",
				password: undefined,
			});

			const result = await authService.login({
				email: "test@example.com",
				password: "password",
			});

			expect(result).toEqual({
				access_token: "mocked_jwt_token",
				user: { ...mockUser, password: undefined },
			});
		});

		it("should throw UnauthorizedException if credentials are invalid", async () => {
			jest.spyOn(authService, "validateUser").mockResolvedValue(null);

			await expect(
				authService.login({ email: "test@example.com", password: "wrongpass" }),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("register", () => {
		it("should call userService.createOne and return the created user", async () => {
			const userDto = { email: "test@example.com", password: "password" };
			const createdUser = { ...mockUser, ...userDto };
			jest.spyOn(userService, "createOne").mockResolvedValue(createdUser);

			const result = await authService.register(userDto);
			expect(result).toEqual(createdUser);
		});
	});
});
