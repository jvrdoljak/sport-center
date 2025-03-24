import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from "class-validator";

export class CreateUserDto {
	@ApiProperty({ example: "user@example.com" })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ example: "password123" })
	@IsNotEmpty()
	@IsString()
	@MinLength(8, { message: "password must have at least 8 characters" })
	@Matches(/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/, {
		message: "password must have at least one special symbol",
	})
	@Matches(/(?=.*\d)/, { message: "password must have at least one number" })
	@Matches(/(?=.*[A-Z])/, {
		message: "password must have at least one uppecase letter",
	})
	@Matches(/(?=.*[a-z])/, {
		message: "password must have at least one lowercase letter",
	})
	password: string;
}
