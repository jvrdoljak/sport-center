import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassModule } from "src/class/class.module";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";
import { Enrollment } from "./entities/enrollment.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Enrollment]), ClassModule],
	exports: [TypeOrmModule],
	controllers: [EnrollmentController],
	providers: [EnrollmentService],
})
export class EnrollmentModule {}
