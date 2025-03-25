import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportModule } from "src/sport/sport.module";
import { ClassController } from "./class.controller";
import { ClassService } from "./class.service";
import { Class } from "./entities/class.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Class]), SportModule],
	exports: [TypeOrmModule, ClassService],
	providers: [ClassService],
	controllers: [ClassController],
})
export class ClassModule {}
