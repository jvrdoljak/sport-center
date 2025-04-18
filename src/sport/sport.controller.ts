import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";
import { SportService } from "./sport.service";

@Controller("sport")
export class SportController {
	constructor(private readonly sportService: SportService) {}

	/**
	 * Find all sports.
	 * @returns
	 */
	@Get()
	@ApiOperation({ summary: "Find all sports" })
	@ApiResponse({ status: 200, description: "Return all sports." })
	findAll() {
		return this.sportService.findAll();
	}

	/**
	 * Find sport by id.
	 * @param id
	 * @returns
	 */
	@Get(":id")
	@ApiOperation({ summary: "Find sport by id" })
	@ApiResponse({ status: 200, description: "Return the sport." })
	@ApiResponse({ status: 404, description: "Sport not found." })
	findOne(@Param("id") id: string) {
		return this.sportService.findOne(id);
	}

	/**
	 * Create sport.
	 * @param sport
	 * @returns
	 */
	@Post()
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Create a new sport (Admin only)" })
	@ApiResponse({ status: 201, description: "Sport successfully created." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({
		status: 409,
		description: "Sport with this name already exists.",
	})
	createOne(@Body() sport: CreateSportDto) {
		return this.sportService.createOne(sport);
	}

	/**
	 * Update sport identified by id.
	 * @param id
	 * @param sport
	 * @returns
	 */
	@Put(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Update a sport (Admin only)" })
	@ApiResponse({ status: 200, description: "Sport successfully updated." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Sport not found." })
	@ApiResponse({
		status: 409,
		description: "Sport with this name already exists.",
	})
	updateOne(@Param("id") id: string, @Body() sport: UpdateSportDto) {
		return this.sportService.updateOne(id, sport);
	}

	/**
	 * Delete sport by id.
	 * @param id
	 * @returns
	 */
	@Delete(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Delete a sport (Admin only)" })
	@ApiResponse({ status: 200, description: "Sport successfully deleted." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Sport not found." })
	deleteOne(@Param("id") id: string) {
		return this.sportService.deleteOne(id);
	}
}
