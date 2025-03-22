import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { EnrollmentsService } from "./enrollments.service";

@Controller("enrollments")
export class EnrollmentsController {
	constructor(private readonly enrollmentsService: EnrollmentsService) {}

	/**
	 * Creates enrollment for identified user by request.
	 * @param req
	 * @param createEnrollmentDto
	 * @returns
	 */
	@Post()
	@ApiOperation({ summary: "Creates enrollment for identified user by request." })
	@ApiResponse({ status: 201, description: "Successfully enrolled in the class." })
	@ApiResponse({ status: 400, description: "Bad request or class is at full capacity." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 404, description: "Class not found." })
	@ApiResponse({ status: 409, description: "User is already enrolled in this class." })
	create(@Req() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
		return this.enrollmentsService.create(req.user.id, createEnrollmentDto);
	}

	/**
	 * Find all enrollments.
	 * @returns
	 */
	@Get()
	@Roles(Role.Admin)
	@ApiOperation({ summary: "Find all enrollments (Admin only)" })
	@ApiResponse({ status: 200, description: "Return all enrollments." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	findAll() {
		return this.enrollmentsService.findAll();
	}

	/**
	 * Find enrollments assigned to user from request.
	 * @param req
	 * @returns
	 */
	@Get("my-enrollments")
	@ApiOperation({ summary: 'Find enrollments assigned to user from request.' })
	@ApiResponse({ status: 200, description: 'Return user\'s enrollments.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	findMyEnrollments(@Req() req) {
		return this.enrollmentsService.findByUser(req.user.id);
	}

	/**
	 * Find all enrollments identified by class.
	 * @param classId
	 * @returns
	 */
	@Get("class/:classId")
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Find all enrollments identified by class. (Admin only)' })
	@ApiResponse({ status: 200, description: 'Return enrollments for the class.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	findByClass(@Param("classId") classId: string) {
		return this.enrollmentsService.findByClass(classId);
	}

	/**
	 * Delete enrolment identified by class and user.id from request.
	 * @param id
	 * @param req
	 * @returns
	 */
	@Delete(":id")
	@ApiOperation({ summary: "Delete enrolment identified by class and user.id from request." })
	@ApiResponse({ status: 200, description: "Enrollment successfully canceled." })
	@ApiResponse({ status: 400, description: "Enrollment does not belong to the user." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 404, description: "Enrollment not found." })
	delete(@Param("id") id: string, @Req() req) {
		return this.enrollmentsService.delete(id, req.user.id);
	}
}
