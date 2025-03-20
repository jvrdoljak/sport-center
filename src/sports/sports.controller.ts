import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateSportDto } from "./dto/createSport.dto";
import { UpdateSportDto } from "./dto/updateSport.dto";
import { SportsService } from "./sports.service";

@Controller("sports")
export class SportsController {
	constructor(private readonly sportsService: SportsService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.sportsService.findAll();
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	findOne(@Param("id") id: string) {
		return this.sportsService.findOne(id);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createOne(@Body() sport: CreateSportDto) {
		return this.sportsService.createOne(sport);
	}

	@Put(":id")
	@UseGuards(JwtAuthGuard)
	updateOne(@Param("id") id: string, @Body() sport: UpdateSportDto) {
		return this.sportsService.updateOne(id, sport);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	deleteOne(@Param("id") id: string) {
		return this.sportsService.deleteOne(id);
	}
}
