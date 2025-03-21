import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";

class ScheduleDto {
	@IsNotEmpty()
	@IsString()
	day: string;

	@IsNotEmpty()
	@IsString()
	startTime: string;

	@IsNotEmpty()
	@IsString()
	endTime: string;
}

export class CreateClassDto {
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ScheduleDto)
	schedule: ScheduleDto[];

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
