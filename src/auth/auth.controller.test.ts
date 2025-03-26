import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

describe("AuthController", () => {
	let controller: AuthController;
	let service: AuthService;

	const mockAuthService = {
		register: jest.fn((dto) => ({
			id: "1",
			email: dto.email,
			message: "User successfully registered.",
		})),
		login: jest.fn((dto) => ({
			accessToken: "mockToken123",
		})),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: mockAuthService }],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should register a new user", async () => {
		const dto: RegisterDto = {
			email: "test@example.com",
			password: "password123",
		};
		expect(await controller.register(dto)).toEqual({
			id: "1",
			email: "test@example.com",
			message: "User successfully registered.",
		});
		expect(service.register).toHaveBeenCalledWith(dto);
	});

	it("should log in a user", async () => {
		const dto: LoginDto = {
			email: "test@example.com",
			password: "password123",
		};
		expect(await controller.login(dto)).toEqual({
			accessToken: "mockToken123",
		});
		expect(service.login).toHaveBeenCalledWith(dto);
	});
});
