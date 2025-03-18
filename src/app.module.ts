import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ClassesModule } from "./classes/classes.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		ClassesModule,
		UsersModule,
		AuthModule,
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
			}),
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
