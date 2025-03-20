import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassesModule } from "src/classes/classes.module";
import { EnrollmentsController } from "./enrollments.controller";
import { EnrollmentsService } from "./enrollments.service";
import { Enrollment } from "./entities/enrollment.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Enrollment]), ClassesModule],
	exports: [TypeOrmModule],
	controllers: [EnrollmentsController],
	providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
