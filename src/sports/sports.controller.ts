import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { CreateSportDto } from "./dto/createSport.dto";
import { UpdateSportDto } from "./dto/updateSport.dto";
import { SportsService } from "./sports.service";

@Controller("sports")
export class SportsController {
	constructor(private readonly sportsService: SportsService) {}

	/**
	 * Find all sports.
	 * @returns
	 */
	@Get()
	findAll() {
		return this.sportsService.findAll();
	}

	/**
	 * Find sport by id.
	 * @param id
	 * @returns
	 */
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.sportsService.findOne(id);
	}

	/**
	 * Create sport.
	 * @param sport
	 * @returns
	 */
	@Post()
	@Roles(Role.Admin)
	createOne(@Body() sport: CreateSportDto) {
		return this.sportsService.createOne(sport);
	}

	/**
	 * Update sport identified by id.
	 * @param id
	 * @param sport
	 * @returns
	 */
	@Put(":id")
	@Roles(Role.Admin)
	updateOne(@Param("id") id: string, @Body() sport: UpdateSportDto) {
		return this.sportsService.updateOne(id, sport);
	}

	/**
	 * Delete sport by id.
	 * @param id
	 * @returns
	 */
	@Delete(":id")
	@Roles(Role.Admin)
	deleteOne(@Param("id") id: string) {
		return this.sportsService.deleteOne(id);
	}
}
