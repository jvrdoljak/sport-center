import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { EnrollmentsService } from "./enrollments.service";

@Controller("enrollments")
export class EnrollmentsController {
	constructor(private readonly enrollmentsService: EnrollmentsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Req() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
		return this.enrollmentsService.create(req.user.id, createEnrollmentDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.enrollmentsService.findAll();
	}

	@Get("my-enrollments")
	@UseGuards(JwtAuthGuard)
	findMyEnrollments(@Req() req) {
		return this.enrollmentsService.findByUser(req.user.id);
	}

	@Get("class/:classId")
	@UseGuards(JwtAuthGuard)
	findByClass(@Param("classId") classId: string) {
		return this.enrollmentsService.findByClass(classId);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	delete(@Param("id") id: string, @Req() req) {
		return this.enrollmentsService.delete(id, req.user.id);
	}
}
