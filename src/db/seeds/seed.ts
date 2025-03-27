import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { Class } from "src/class/entities/class.entity";
import {
	INITIAL_ADMIN_EMAIL,
	INITIAL_ADMIN_PASSWORD,
} from "src/common/config/config";
import { Role } from "src/common/enums/role";
import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { Sport } from "src/sport/entities/sport.entity";
import { User } from "src/user/entitites/user.entity";
import dataSource from "../data-source";

async function seed() {
	await dataSource.initialize();
	console.log("Connected to database!");

	const userRepository = dataSource.getRepository(User);
	const sportRepository = dataSource.getRepository(Sport);
	const classRepository = dataSource.getRepository(Class);
	const enrollmentsRepository = dataSource.getRepository(Enrollment);

	const admin = await userRepository.findOne({
		where: { email: INITIAL_ADMIN_EMAIL },
	});

	if (!admin) {
		const hashedPassword = await hash(INITIAL_ADMIN_PASSWORD, 10);
		const newUser = userRepository.create({
			email: INITIAL_ADMIN_EMAIL,
			password: hashedPassword,
			role: Role.Admin,
		});
		await userRepository.save(newUser);
		console.log("Admin user created!");
	} else {
		console.log("Admin user already exists!");
	}

	for (let i = 0; i < 10; i++) {
		const hashedPassword = await hash("testPassword1234!", 10);
		const newUser = userRepository.create({
			email: faker.internet.email(),
			password: hashedPassword,
			role: Role.User,
		});
		await userRepository.save(newUser);

		const newSport = await sportRepository.create({
			name: faker.lorem.word(),
		});
		await sportRepository.save(newSport);

		const newClass = await classRepository.create({
			capacity: faker.number.int(200),
			description: faker.word.noun(20),
			schedule: [
				{
					day: faker.date.weekday(),
					startTime: faker.helpers.arrayElement([
						"08:00",
						"09:00",
						"10:30",
						"12:00",
					]),
					endTime: faker.helpers.arrayElement([
						"09:00",
						"10:30",
						"12:00",
						"13:30",
					]),
				},
			],
			sportId: newSport.id,
			durationMins: faker.number.int(120),
		});
		await classRepository.save(newClass);

		const newEnrollment = enrollmentsRepository.create({
			classId: newClass.id,
			userId: newUser.id,
		});
		await enrollmentsRepository.save(newEnrollment);

		console.log(`Seed round ${i + 1} of 10 done.`);
	}

	return;
}
seed().finally(() => console.log("Done"));

seed().catch((err) => console.error("Seeding failed", err));
