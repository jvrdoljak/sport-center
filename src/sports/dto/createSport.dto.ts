import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSportDto {
	@ApiProperty({ example: "Basketball" })
	@IsNotEmpty()
	@IsString()
	name: string;
}
