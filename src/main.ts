import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
	APP_PORT,
	INITIAL_ADMIN_EMAIL,
	INITIAL_ADMIN_PASSWORD,
} from "./common/config/config";
import { Role } from "./common/enums/role";
import { logger } from "./logger";
import { UsersService } from "./users/users.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { logger });
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	// Create initial user on startup
	const usersService = app.get(UsersService);
	if (
		await usersService.creatInitialAdminAccount(
			{
				email: INITIAL_ADMIN_EMAIL,
				password: INITIAL_ADMIN_PASSWORD,
			},
			Role.Admin,
		)
	) {
		logger.log(`User: ${INITIAL_ADMIN_EMAIL} successfully created.`);
	}

	// Swagger documentation setup
	const config = new DocumentBuilder()
		.setTitle("Sports Center API")
		.setDescription("API for managing sports classes and enrollments")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);

	app.enableCors();

	await app.listen(APP_PORT);
}
bootstrap();
