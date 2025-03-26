import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppInterceptor } from "./app.interceptor";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ClassModule } from "./class/class.module";
import {
	DATABASE_HOST,
	DATABASE_NAME,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USERNAME,
} from "./common/config/config";
import { RolesGuard } from "./common/guards/roles.guard";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { SportModule } from "./sport/sport.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: "mysql",
				host: DATABASE_HOST,
				port: DATABASE_PORT,
				username: DATABASE_USERNAME,
				password: DATABASE_PASSWORD,
				database: DATABASE_NAME,
				entities: [__dirname + "/**/*.entity{.ts,.js}"],
				migrations: ["src/migrations/*.ts"],
			}),
		}),
		ClassModule,
		UserModule,
		AuthModule,
		SportModule,
		EnrollmentModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppInterceptor,
		},
	],
})
export class AppModule {}
