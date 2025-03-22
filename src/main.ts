import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Role } from "./common/enums/role";
import {
	APP_PORT,
	INITIAL_ADMIN_EMAIL,
	INITIAL_ADMIN_PASSWORD,
} from "./config";
import { UsersService } from "./users/users.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
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
		console.info("User: admin@sport-center.com successfully created.");
	}

	// Swagger documentation setup
	const config = new DocumentBuilder()
    .setTitle("Sports Center API")
    .setDescription("API for managing sports classes and enrollments")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("api/docs", app, document)

	app.enableCors();

	await app.listen(APP_PORT);
}
bootstrap();
