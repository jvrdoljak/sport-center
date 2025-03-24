import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppInterceptor } from "./app.interceptor";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ClassesModule } from "./classes/classes.module";
import { RolesGuard } from "./common/guards/roles.guard";
import {
	DATABASE_HOST,
	DATABASE_NAME,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USERNAME,
} from "./config";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { SportsModule } from "./sports/sports.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: "mysql",
				host: DATABASE_HOST,
				port: DATABASE_PORT,
				username: DATABASE_USERNAME,
				password: DATABASE_PASSWORD,
				database: DATABASE_NAME,
				entities: [__dirname + "/**/*.entity{.ts,.js}"],
				synchronize: true,
				migrations: ["src/migrations/*.ts"],
				cli: {
					migrationsDir: "src/migrations",
				},
				autoLoadEntities: true,
			}),
		}),
		ClassesModule,
		UsersModule,
		AuthModule,
		SportsModule,
		EnrollmentsModule,
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
