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
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateSportDto } from "./dto/createSport.dto";
import { UpdateSportDto } from "./dto/updateSport.dto";
import { SportsService } from "./sports.service";

@Controller("sports")
export class SportsController {
	constructor(private readonly sportsService: SportsService) {}

	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	findAll() {
		return this.sportsService.findAll();
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	findOne(@Param("id") id: string) {
		return this.sportsService.findOne(id);
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	createOne(@Body() sport: CreateSportDto) {
		return this.sportsService.createOne(sport);
	}

	@Put(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	updateOne(@Param("id") id: string, @Body() sport: UpdateSportDto) {
		return this.sportsService.updateOne(id, sport);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	deleteOne(@Param("id") id: string) {
		return this.sportsService.deleteOne(id);
	}
}
