import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { ClassService } from "./class.service";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";

@Controller("class")
export class ClassController {
	constructor(private readonly classService: ClassService) {}

	/**
	 * Find all classes filtered by sports.
	 * @param sports
	 * @returns
	 */
	@Get()
	@ApiOperation({ summary: "Find all classes with optional sport filtering" })
	@ApiQuery({
		name: "sports",
		required: false,
		description: "Filter by sport names (comma-separated)",
	})
	@ApiResponse({ status: 200, description: "Return all classes." })
	findAll(@Query("sports") sports?: string) {
		return this.classService.findAll(sports);
	}

	/**
	 * Find one class identified by id.
	 * @param sports
	 * @returns
	 */
	@Get(":id")
	@ApiOperation({ summary: "Get a class by id" })
	@ApiResponse({ status: 200, description: "Return the class." })
	@ApiResponse({ status: 404, description: "Class not found." })
	findOne(@Param("id") id: string) {
		return this.classService.findOne(id);
	}

	/**
	 * Create one class.
	 * @param sports
	 * @returns
	 */
	@Post()
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Create a new class (Admin only)" })
	@ApiResponse({ status: 201, description: "Class successfully created." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Sport not found." })
	createOne(@Body() createClassDto: CreateClassDto) {
		return this.classService.createOne(createClassDto);
	}

	/**
	 * Update one class identified by id.
	 * @param sports
	 * @returns
	 */
	@Put(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Update a class (Admin only)" })
	@ApiResponse({ status: 200, description: "Class successfully updated." })
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Class not found." })
	updateOne(@Param("id") id: string, @Body() updateClassDto: UpdateClassDto) {
		return this.classService.updateOne(id, updateClassDto);
	}

	/**
	 * Delete class identified by id.
	 * @param sports
	 * @returns
	 */
	@Delete(":id")
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Delete a class (Admin only)" })
	@ApiResponse({ status: 200, description: "Class successfully deleted." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Class not found." })
	deleteOne(@Param("id") id: string) {
		return this.classService.deleteOne(id);
	}

	/**
	 * Check class availability
	 * @param id
	 * @returns
	 */
	@Get(":id/availability")
	@ApiOperation({ summary: "Check class availability" })
	@ApiResponse({ status: 200, description: "Return class availability." })
	@ApiResponse({ status: 404, description: "Class not found." })
	checkAvailability(@Param("id") id: string) {
		return this.classService.checkAvailability(id);
	}
}
