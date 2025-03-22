import { Body, Controller, Post } from "@nestjs/common";
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
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
