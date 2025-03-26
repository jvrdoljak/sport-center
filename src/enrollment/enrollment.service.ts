import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassService } from "src/class/class.service";
import type { DeleteResult, Repository } from "typeorm";
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { Enrollment } from "./entities/enrollment.entity";

@Injectable()
export class EnrollmentService {
	constructor(
		@InjectRepository(Enrollment)
		private enrollmentRepository: Repository<Enrollment>,
		private classService: ClassService,
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
		await this.classService.findOne(createEnrollmentDto.classId);

		// Check if the user is already enrolled in this class
		const existingEnrollment = await this.enrollmentRepository.findOne({
			where: {
				userId,
				classId: createEnrollmentDto.classId,
			},
		});

		if (!!existingEnrollment) {
			throw new ConflictException("User is already enrolled in this class");
		}

		// Check if the class has available spots
		const availability = await this.classService.checkAvailability(
			createEnrollmentDto.classId,
		);

		if (!availability.available) {
			throw new BadRequestException("Class is at full capacity");
		}

		const enrollment = this.enrollmentRepository.create({
			userId,
			classId: createEnrollmentDto.classId,
		});

		return this.enrollmentRepository.save(enrollment);
	}

	/**
	 * Find all enrollments.
	 * @returns
	 */
	async findAll(): Promise<Enrollment[]> {
		return this.enrollmentRepository.find({
			relations: ["user", "class", "class.sport"],
		});
	}

	/**
	 * Find enrollments filtered by userId.
	 * @param userId
	 * @returns
	 */
	async findByUser(userId: string): Promise<Enrollment[]> {
		return this.enrollmentRepository.find({
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
		return this.enrollmentRepository.find({
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
		const enrollment = await this.enrollmentRepository.findOne({
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
	async delete(id: string, userId: string): Promise<DeleteResult> {
		const enrollment = await this.findOne(id);

		// Check if the enrollment belongs to the user
		if (enrollment.userId !== userId) {
			throw new BadRequestException("Enrollment does not belong to the user");
		}

		return await this.enrollmentRepository.delete(id);
	}
}
