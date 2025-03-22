import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "src/common/enums/role";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { User } from "./entitites/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	/**
	 * Find all users.
	 * @returns
	 */
	async findAll(): Promise<Array<User>> {
		return await this.usersRepository.find({
			relations: ["enrollments"],
		});
	}

	/**
	 * Find one user identified by id.
	 * @param id
	 * @returns
	 */
	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { id },
			relations: ["enrollments"],
		});
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	/**
	 * Find user by email.
	 * @param email
	 * @returns
	 */
	async findByEmail(email: string): Promise<User | null> {
		return await this.usersRepository.findOne({ where: { email } });
	}

	/**
	 * Create initial admin account if not exists.
	 * @param createUserDto
	 * @param role
	 * @returns
	 */
	async creatInitialAdminAccount(
		createUserDto: CreateUserDto,
		role: Role = Role.User,
	): Promise<User | null> {
		const existingUser = await this.usersRepository.findOne({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			return null;
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = this.usersRepository.create({
			...createUserDto,
			password: hashedPassword,
			role,
		});

		return this.usersRepository.save(user);
	}

	/**
	 * Create new user.
	 * @param createUserDto
	 * @param role
	 * @returns
	 */
	async createOne(
		createUserDto: CreateUserDto,
		role: Role = Role.User,
	): Promise<User> {
		const existingUser = await this.usersRepository.findOne({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException("Email already exists");
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = this.usersRepository.create({
			...createUserDto,
			password: hashedPassword,
			role,
		});

		return this.usersRepository.save(user);
	}

	/**
	 * Update one user identified by id.
	 * @param id
	 * @param updateUserDto
	 * @returns
	 */
	async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (updateUserDto.password) {
			updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
		}

		Object.assign(user, updateUserDto);

		return this.usersRepository.save(user);
	}

	/**
	 * Delete user identified by id.
	 * @param id
	 */
	async deleteOne(id: string): Promise<void> {
		const result = await this.usersRepository.delete({ id });

		if (result.affected === 0) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}
}
