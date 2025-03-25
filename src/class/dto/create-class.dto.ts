import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";

class ScheduleDto {
	@ApiProperty({ example: "Monday" })
	@IsNotEmpty()
	@IsString()
	day: string;

	@ApiProperty({ example: "09:00" })
	@IsNotEmpty()
	@IsString()
	startTime: string;

	@ApiProperty({ example: "10:30" })
	@IsNotEmpty()
	@IsString()
	endTime: string;
}

export class CreateClassDto {
	@ApiProperty({
		type: [ScheduleDto],
		example: [
			{ day: "Monday", startTime: "09:00", endTime: "10:30" },
			{ day: "Wednesday", startTime: "09:00", endTime: "10:30" },
			{ day: "Friday", startTime: "09:00", endTime: "10:30" },
		],
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ScheduleDto)
	schedule: ScheduleDto[];

	@ApiProperty({ example: 90 })
	@IsNotEmpty()
	durationMins: number;

	@ApiProperty({ example: "Learn the basic skills football." })
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
	@IsNotEmpty()
	@IsUUID()
	sportId: string;

	@ApiProperty({ example: 20 })
	@IsNotEmpty()
	capacity: number;
}
