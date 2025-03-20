import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ClassesModule } from "./classes/classes.module";
import { RolesGuard } from "./common/guards/roles.guard";
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
				host: process.env.DATABASE_HOST || "localhost",
				port: parseInt(process.env.DATABASE_PORT || "3306"),
				username: process.env.DATABASE_USER || "sport_center_admin",
				password: process.env.DATABASE_PASSWORD || "0g[~y16Atl,1",
				database: process.env.DATABASE_NAME || "sport_center",
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
	],
})
export class AppModule {}
