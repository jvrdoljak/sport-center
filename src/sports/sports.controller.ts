import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { CreateSportDto } from "./dto/createSport.dto";
import { UpdateSportDto } from "./dto/updateSport.dto";
import { SportsService } from "./sports.service";

@Controller("sports")
export class SportsController {
	constructor(private readonly sportsService: SportsService) {}

	@Get()
	findAll() {
		return this.sportsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.sportsService.findOne(id);
	}

	@Post()
	createOne(@Body() sport: CreateSportDto) {
		return this.sportsService.createOne(sport);
	}

	@Put(":id")
	updateOne(@Param("id") id: string, @Body() sport: UpdateSportDto) {
		return this.sportsService.updateOne(id, sport);
	}

	@Delete(":id")
	deleteOne(@Param("id") id: string) {
		return this.sportsService.deleteOne(id);
	}
}
