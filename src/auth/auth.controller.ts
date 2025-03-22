import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Register user.
	 * @param registerDto
	 * @returns
	 */
	@Post("register")
	@Public()
	@ApiOperation({ summary: "Register a new user" })
	@ApiResponse({ status: 201, description: "User successfully registered." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 409, description: "Email already exists." })
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	/**
	 * Login user.
	 * @param registerDto
	 * @returns
	 */
	@Post("login")
	@Public()
	@ApiOperation({ summary: "Login with email and password" })
	@ApiResponse({ status: 200, description: "User successfully logged in." })
	@ApiResponse({ status: 401, description: "Invalid credentials." })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
