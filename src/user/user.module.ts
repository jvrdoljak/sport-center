import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entitites/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	exports: [TypeOrmModule, UserService],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
