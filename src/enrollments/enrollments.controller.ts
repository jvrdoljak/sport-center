import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from "@nestjs/common";
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
	create(@Req() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
		return this.enrollmentsService.create(req.user.id, createEnrollmentDto);
	}

	/**
	 * Find all enrollments.
	 * @returns
	 */
	@Get()
	@Roles(Role.Admin)
	findAll() {
		return this.enrollmentsService.findAll();
	}

	/**
	 * Find enrollments assigned to user from request.
	 * @param req
	 * @returns
	 */
	@Get("my-enrollments")
	findMyEnrollments(@Req() req) {
		return this.enrollmentsService.findByUser(req.user.id);
	}

	/**
	 * Find all enrollments identified by class.
	 * @param classId
	 * @returns
	 */
	@Get("class/:classId")
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
	delete(@Param("id") id: string, @Req() req) {
		return this.enrollmentsService.delete(id, req.user.id);
	}
}
