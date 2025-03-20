import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateClassDto {
	@IsNotEmpty()
	schedule: string;

	@IsNotEmpty()
	durationMins: number;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsUUID()
	sportId: string;

	@IsNotEmpty()
	capacity: number;
}
