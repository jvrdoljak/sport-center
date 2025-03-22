import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassesService } from "src/classes/classes.service";
import type { Repository } from "typeorm";
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { Enrollment } from "./entities/enrollment.entity";

@Injectable()
export class EnrollmentsService {
	constructor(
		@InjectRepository(Enrollment)
		private enrollmentsRepository: Repository<Enrollment>,
		private classesService: ClassesService,
	) {}

	/**
	 * Creates user identified by id.
	 * @param userId
	 * @param createEnrollmentDto
	 * @returns
	 */
	async create(
		userId: string,
		createEnrollmentDto: CreateEnrollmentDto,
	): Promise<Enrollment> {
		// Check if the class exists
		await this.classesService.findOne(createEnrollmentDto.classId);

		// Check if the user is already enrolled in this class
		const existingEnrollment = await this.enrollmentsRepository.findOne({
			where: {
				userId,
				classId: createEnrollmentDto.classId,
			},
		});

		if (existingEnrollment) {
			throw new ConflictException("User is already enrolled in this class");
		}

		// Check if the class has available spots
		const availability = await this.classesService.checkAvailability(
			createEnrollmentDto.classId,
		);

		if (!availability.available) {
			throw new BadRequestException("Class is at full capacity");
		}

		const enrollment = this.enrollmentsRepository.create({
			userId,
			classId: createEnrollmentDto.classId,
		});

		return this.enrollmentsRepository.save(enrollment);
	}

	/**
	 * Find all enrollments.
	 * @returns
	 */
	async findAll(): Promise<Enrollment[]> {
		return this.enrollmentsRepository.find({
			relations: ["user", "class", "class.sport"],
		});
	}

	/**
	 * Find enrollments filtered by userId.
	 * @param userId
	 * @returns
	 */
	async findByUser(userId: string): Promise<Enrollment[]> {
		return this.enrollmentsRepository.find({
			where: { userId },
			relations: ["class", "class.sport"],
		});
	}

	/**
	 * Find elrollments filtered by classId.
	 * @param classId
	 * @returns
	 */
	async findByClass(classId: string): Promise<Enrollment[]> {
		return this.enrollmentsRepository.find({
			where: { classId },
			relations: [],
		});
	}

	/**
	 * Find one enrollment identified by id.
	 * @param id
	 * @returns
	 */
	async findOne(id: string): Promise<Enrollment> {
		const enrollment = await this.enrollmentsRepository.findOne({
			where: { id },
			relations: ["user", "class", "class.sport"],
		});

		if (!enrollment) {
			throw new NotFoundException(`Enrollment with ID ${id} not found`);
		}

		return enrollment;
	}

	/**
	 * Delete enrollment identified by id.
	 * @param id
	 * @param userId
	 */
	async delete(id: string, userId: string): Promise<void> {
		const enrollment = await this.findOne(id);

		// Check if the enrollment belongs to the user
		if (enrollment.userId !== userId) {
			throw new BadRequestException("Enrollment does not belong to the user");
		}

		await this.enrollmentsRepository.remove(enrollment);
	}
}
