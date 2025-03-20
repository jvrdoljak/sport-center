import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto {
	@IsNotEmpty()
	@IsDate()
	schedule: Date;

	@IsNotEmpty()
	durationMins: number;

	@IsNotEmpty()
	@IsString()
	description: string;
}
