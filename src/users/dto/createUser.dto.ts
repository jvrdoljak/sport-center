import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty({ example: "user@example.com" })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ example: "password123" })
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}
