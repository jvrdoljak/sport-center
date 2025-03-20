import { IsNotEmpty, IsString } from "class-validator";

export class CreateSportDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}
