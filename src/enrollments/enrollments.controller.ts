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

	@Post()
	create(@Req() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
		return this.enrollmentsService.create(req.user.id, createEnrollmentDto);
	}

	@Get()
	@Roles(Role.Admin)
	findAll() {
		return this.enrollmentsService.findAll();
	}

	@Get("my-enrollments")
	findMyEnrollments(@Req() req) {
		return this.enrollmentsService.findByUser(req.user.id);
	}

	@Get("class/:classId")
	findByClass(@Param("classId") classId: string) {
		return this.enrollmentsService.findByClass(classId);
	}

	@Delete(":id")
	delete(@Param("id") id: string, @Req() req) {
		return this.enrollmentsService.delete(id, req.user.id);
	}
}
