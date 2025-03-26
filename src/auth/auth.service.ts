import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "src/user/entitites/user.entity";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	/**
	 * Validate user credentials.
	 * @param email
	 * @param password
	 * @returns
	 */
	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByEmail(email);

		if (user && (await bcrypt.compare(password, user.password))) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	/**
	 * Login user.
	 * @param loginDto
	 * @returns
	 */
	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto.email, loginDto.password);

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const payload = { email: user.email, sub: user.id, roles: [user.role] };

		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}

	/**
	 * Register a new user.
	 * @param registerDto
	 * @returns
	 */
	async register(registerDto: RegisterDto): Promise<User> {
		return this.userService.createOne(registerDto);
	}
}
