import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportsModule } from "src/sports/sports.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";
import { Class } from "./entities/class.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Class]), SportsModule],
	exports: [TypeOrmModule, ClassesService],
	providers: [ClassesService],
	controllers: [ClassesController],
})
export class ClassesModule {}
